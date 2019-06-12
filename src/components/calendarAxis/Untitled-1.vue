<template>
  <div class="calendar-axis">
    <div class="time-container" :class="{ 'college': !colleges }">
      <ul class="college-list" ref="collegeList" v-if="colleges">
        <li 
          v-for="(college, index) in colleges" 
          :key="college.id"
          :class="{ 'not-selected': college.hide }"
          class="college-item" 
        >
          <i class="border-left" :style="'background:' + colors[index]"></i>
          <div class="college-box" @click="collegeFilter(college)">
            {{ college.name_cn ? college.name_cn : college.name }}
          </div>
        </li>
        <li class="no-college" v-if="colleges.length === 0">
          您还没有选校
        </li>
      </ul>
      <ul class="calendar-label">
        <li class="day-label">
          MON
        </li>
        <li class="day-label">
          TUE
        </li>
        <li class="day-label">
          WEN
        </li>
        <li class="day-label">
          THU
        </li>
        <li class="day-label">
          FRI
        </li>
        <li class="day-label">
          SAT
        </li>
        <li class="day-label">
          SUN
        </li>
      </ul>
      <div class="calendar-scroll-container" ref="calendarScroll">
        <div class="calendar-scroll-box">
          <div id="calendar"></div>
          <div id="calendar-bg"></div>
        </div>
      </div>
      <ul class="deadline-list" ref="deadlineList">
        <li class="deadline" v-for="(deadline, index) in deadlines" :key="index" @click="deadlineFilter(deadline)">
          <p class="deadline-icon" :class="{ 'not-selected': deadline.hide }" v-html=allDeadlinesIcon[deadline.id]></p>
          <p class="deadline-text">{{ deadline.name }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
// import Api from "../../../../../../common/api.js";
import BScroll from "better-scroll";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/calendar";
import "echarts/lib/chart/custom";
import "echarts/lib/chart/scatter";
import "echarts/lib/chart/heatmap";
import "echarts/lib/component/tooltip";
export default {
  data() {
    return {
      colors: [
        // 颜色预选项
        "#67afca",
        "#da3d3d",
        "#e49945",
        "#b9df1f",
        "#e67d87",
        "#f3d13b",
        "#916be4",
        "#7e5c4f",
        "#62c1a1",
        "#ffa7b0",

        "#e74c3c",
        "#f1a9a0",
        "#db0a5b",
        "#f62459",
        "#aea8d3",
        "#663399",
        "#4183d7",
        "#00e640"
      ],
      allDeadlinesIcon: [
        // 图标预选项，按数组索引，与申请时间的id对应（索引从1开始，因此数组第一位为空）
        '',
        require("@/assets/images/Alert1.svg.js"),
        require("@/assets/images/Alert2.svg.js"),
        require("@/assets/images/Supplementary.svg.js"),
        require("@/assets/images/tiqianluqujiezhi.svg.js"),
        require("@/assets/images/tiqianluqutongzhi.svg.js"),
        require("@/assets/images/zaoqixingdongjiezhi.svg.js"),
        require("@/assets/images/zaoqixingdongtongzhi.svg.js"),
        require("@/assets/images/jiangjinyouxian.svg.js"),
        require("@/assets/images/jiangjinzuizhong.svg.js"),
        require("@/assets/images/jiangjintongzhi.svg.js"),
        require("@/assets/images/Tz.svg.js"),
        require("@/assets/images/T.svg.js"),
        require("@/assets/images/lz.svg.js"),
        require("@/assets/images/l.svg.js"),
        require("@/assets/images/Sz.svg.js"),
        require("@/assets/images/S.svg.js"),
        require("@/assets/images/Az.svg.js"),
        require("@/assets/images/A.svg.js"),
        require("@/assets/images/Gz.svg.js"),
        require("@/assets/images/G.svg.js"),
        require("@/assets/images/Mz.svg.js"),
        require("@/assets/images/M.svg.js"),
        require("@/assets/images/Wz.svg.js"),
        require("@/assets/images/Language.svg.js"),
        require("@/assets/images/Standardized.svg.js")
      ],
      largeLayouts: [
        // 每条线，每个节点偏移的距离, 按节点图标的宽高倍数偏移,每所学校的时间轴，偏移相同；避免节点图标重叠
        [[-1.5, -1.5]], // 左上
        [[0, -1.5]], // 中上
        [[1.5, -1.5]], // 右上
        [[-1.5, 0]], // 左中
        [[0, 0]], // 中中
        [[1.5, 0]], // 右中
        [[-1.5, 1.5]], // 左下
        [[0, 1.5]], // 中下
        [[1.5, 1.5]] // 右下
      ],
      smallLayouts: [
        // 每条线，每个节点偏移的距离, 按节点图标的宽高倍数偏移,每所学校的时间轴，偏移相同；避免节点图标重叠
        [[-1.8, -1.8]],
        [[-0.5, -1.8]],
        [[0.8, -1.8]],
        [[2, -1.8]],

        [[-1.8, -0.5]],
        [[-0.5, -0.5]],
        [[0.8, -0.5]],
        [[2, -0.5]],

        [[-1.8, 2]],
        [[-0.5, 2]],
        [[0.8, 2]],
        [[2, 2]],

        [[-1.8, 0.8]],
        [[-0.5, 0.8]],
        [[0.8, 0.8]],
        [[2, 0.8]]
      ],
      hideColleges: [], // 不展示的学校
      hideDeadlines: [], // 不展示的时间节点
      deadlines: this.projectData, // 该学生的所有选校，所涉及到的时间节点，需要显示在图标右侧
      colleges: this.collegesData, // 选校
      axis: this.axisData, // 学校时间轴数据
      whiteBg: require("@/assets/images/whiteBg.svg.js"), // 避免svg空心部分，鼠标无法点选
      dateRange: [] // 时间轴显示范围， 当前月份的前6个月及后6个月
    };
  },
  props: ["axisData", "collegesData", "projectData"],
  mounted() {
    this.scroller = new BScroll(this.$refs.calendarScroll, {
      scrollbar: {
        fade: true,
        interactive: true
      },
      mouseWheel: true
    });
    this.scroller.on("scroll", position => {
      let _this = this;
      let positionY = -position.y;
      // 到达顶部/底部时，window接着滚动
      if (positionY === 0 || positionY === -this.scroller.maxScrollY) {
        if (this.scroller.enabled) {
          this.scroller.disable();
          setTimeout(() => {
            this.scroller.enable();
          }, 50);
        }
      }
    });
    this.initAll();
  },
  watch: {
    // axisData: {
    //   handler: function (val, oldVal) {
    //     // if (val.length === oldVal.length && val[0] && val[0].id === oldVal[0].id) return;
    //     this.axis = val;
    //     if (this.collegesData === undefined) { // 未传入collegesData时，则为某所学校内部的时间日历
    //       this.initAll();
    //     }
    //     if (this.collegesData && this.collegesData.length >= 0) {
    //       // axisData和collegesData,都加载完成，才初始化
    //       this.initAll();
    //     }
    //   },
    //   immediate: true
    // },
    // collegesData: {
    //   handler: function (val, oldVal) {
    //     // if (val.length === oldVal.length) return;
    //     this.colleges = val;
    //     if (this.axisData.length > 0) {
    //       // axisData和collegesData,都加载完成，才初始化
    //       this.initAll();
    //     }
    //   },
    //   immediate: true
    // },
    // projectData(val, oldVal) {
    //   // if (val.length === oldVal.length) return;
    //   this.deadlines = val;
    // }
  },
  methods: {
    /* 
     * 点击学校，单独查看该学校的申请日历
     */
    collegeFilter(college) {
      let id = college.college_id;
      if (this.hideColleges.includes(id)) {
        let index = this.hideColleges.indexOf(id);
        this.hideColleges.splice(index, 1);
        Vue.set(college, "hide", false);
      } else {
        Vue.set(college, "hide", true);
        this.hideColleges.push(id);
      }
      this.initAll();
    },
    deadlineFilter(deadline) {
      let id = deadline.imgSrcId
      if (this.hideDeadlines.includes(id)) {
        let index = this.hideDeadlines.indexOf(id);
        this.hideDeadlines.splice(index, 1);
        Vue.set(deadline, "hide", false);
      } else {
        this.hideDeadlines.push(id);
        Vue.set(deadline, "hide", true);
      }
      this.initAll();
    },
    initAll() {
      this.myChart && this.myChart.dispose();
      this.initDateRange();
      this.initChart();
    },
    /* 
       * 初始化图表
       */
    initChart() {
      let _this = this;
      this.myChart = echarts.init(document.getElementById("calendar"));
      function getVirtulData() {
        // 用于图表中方格里的天数显示
        var date = +echarts.number.parseDate(_this.dateRange[0]);
        var end = +echarts.number.parseDate(_this.dateRange[11]);
        var dayTime = 3600 * 24 * 1000;
        var data = [];
        for (var time = date; time <= end; time += dayTime) {
          data.push([
            echarts.format.formatTime("yyyy-MM-dd", time),
            Math.floor(Math.random() * 10000)
          ]);
        }
        return data;
      }
      var scatterData = getVirtulData();

      var series = [
        {
          // 表格中天的显示
          id: "label",
          type: "scatter",
          z: 10,
          coordinateSystem: "calendar",
          symbolSize: 1,
          itemStyle: {
            color: "transparent"
          },
          label: {
            normal: {
              show: true,
              formatter: function(params) {
                return echarts.number.parseDate(params.value[0]).getDate();
              },
              offset: [16, 20],
              textStyle: {
                color: "#888",
                fontSize: 14,
                fontFamily: "Arial"
              }
            }
          },
          data: scatterData
        },
        {
          // 当前日期，着重显示
          type: "heatmap",
          coordinateSystem: "calendar",
          data: [[new Date(), 0]],
          itemStyle: {
            color: "#b2e2f8"
          },
          tooltip: {
            show: false
          }
        }
      ];

      var customSeires = []; // 自定义的series

      this.initChartBg();
      let layouts = _this.largeLayouts;
      let svgIconSize = 14; // svg大小
      if (this.axis.length > 9) {
        // 选校数量多于9所时，svg宽高要小些
        svgIconSize = 12;
        layouts = _this.smallLayouts;
      }
      let requestData = this.axis.length > 0 ? this.axis : [];
      let formatData = this._formatData(requestData);
      formatData.forEach((data, index) => {
        let renderItem = function(params, api) {
          var cellPoint = api.coord(api.value(0));
          var cellWidth = params.coordSys.cellWidth;
          var cellHeight = params.coordSys.cellHeight;

          var value = api.value(3);
          var events = value;

          if (isNaN(cellPoint[0]) || isNaN(cellPoint[1])) {
            return;
          }
          var group = {
            type: "group",
            children: [
              {
                type: "line",
                z: 1,
                shape: {
                  x1: cellPoint[0] + svgIconSize * layouts[value][0][0],
                  x2:
                    api.coord(
                      formatData[index][params.dataIndexInside + 1]
                    )[0] +
                    svgIconSize * layouts[value][0][0],
                  y1: cellPoint[1] + svgIconSize * layouts[value][0][1],
                  y2:
                    api.coord(
                      formatData[index][params.dataIndexInside + 1]
                    )[1] +
                    svgIconSize * layouts[value][0][1]
                },
                style: {
                  fill: "#ccc",
                  stroke: _this.colors[api.value(3)],
                  lineWidth: 1
                }
              },
              // {
              //   type: "path", // 此path，为了避免svg的透明处，鼠标无法点击（捕捉）到，导致鼠标在svg上移动时tooltip间断显示问题
              //   z: 1,
              //   shape: {
              //     pathData: _this.whiteBg,
              //     x: -(svgIconSize / 2 + 1), // 1为线的宽度
              //     y: -(svgIconSize / 2 + 1),
              //     width: svgIconSize,
              //     height: svgIconSize
              //   },
              //   position: [
              //     cellPoint[0] + svgIconSize * layouts[value][0][0],
              //     cellPoint[1] + svgIconSize * layouts[value][0][1]
              //   ],
              //   style: api.style({
              //     fill: "#fff"
              //   })
              // },
              {
                type: "path",
                z: 100,
                shape: {
                  pathData: _this.allDeadlinesIcon[api.value(1)],
                  x: -(svgIconSize / 2 + 1),
                  y: -(svgIconSize / 2 + 1),
                  width: svgIconSize,
                  height: svgIconSize
                },
                position: [
                  cellPoint[0] + svgIconSize * layouts[value][0][0],
                  cellPoint[1] + svgIconSize * layouts[value][0][1]
                ],
                style: api.style({
                  fill: _this.colors[api.value(3)]
                })
              }
            ]
          };

          return group;
        };
        customSeires.push({
          type: "custom",
          z: 100,
          coordinateSystem: "calendar",
          renderItem: renderItem,
          dimensions: [null, { type: "ordinal" }],
          data: formatData[index],
          tooltip: {
            position: (point, params, dom, react, size) => {
              // 时间重复处理，显示在一个tooltip中
              let tooltipContentItem = "";
              params.data[4].forEach(item => {
                tooltipContentItem += `
                  <p style="color: #888;font-size: 12px;line-height: 26px;">
                    ${item}
                  </p>
                `;
              });

              let tooltipContent = `
                <p style="display: block;font-weight: 700;">
                  ${params.data[2]}
                </p>
                ${tooltipContentItem}
              `;

              $(dom).html(`
                <div 
                  class="tool-box" 
                  style="
                    border-left: 4px solid #e49945;
                    padding: 6px 8px;
                    border-radius: 0 2px 2px 0;
                    border-right: 4px solid #fff;
                    box-shadow: 0 0 10px #ccc;
                    position: relative;"
                >
                  <span style="
                    position: absolute;
                    left: 8px;
                    top: -6px;
                    width: 0;
                    height: 0;
                    border-left: 5px solid transparent;
                    border-right: 5px solid transparent;
                    border-bottom: 6px solid #fff;"
                  ></span>
                  ${tooltipContent}
                </div>
              `);
              return { left: point[0] - 17, top: point[1] + 30 };
            },
            show: true,
            enterable: true,
            backgroundColor: "#fff",
            padding: 0,
            textStyle: {
              color: "#000"
            }
          }
        });
      });
      /* 
       * custom自定义图表左侧年份
       */
      let renderYearLabel = function(params, api) {
        // 不能直接用this.dateRange的值，因为其中有的是31号，而不是1号
        let month = new Date(api.value(0)).getMonth() + 1;
        let monthZero = month > 9 ? month : "0" + month;
        let year = new Date(api.value(0)).getFullYear();
        let cellPointTime = year + "-" + monthZero + "-01";
        let cellPoint = api.coord(Date.parse(cellPointTime));
        let text = year;

        let textOption = {
          type: "text",
          left: 0,
          position: [30, cellPoint[1] - 30],
          style: {
            text: [text],
            font: '15px Arial',
            stroke: "#888",
            fill: "#888"
          }
        };

        return textOption;
      };
      customSeires.push({
        type: "custom",
        z: 1,
        coordinateSystem: "calendar",
        renderItem: renderYearLabel,
        dimensions: [null, { type: "ordinal" }],
        data: _this.dateRange,
        tooltip: {
          show: false
        }
      });
      /* 
          * custom自定义图表左侧月
          */
      let renderMonthLabel = function(params, api) {
        // 不能直接用this.dateRange的值，因为其中有的是31号，而不是1号
        let month = new Date(api.value(0)).getMonth() + 1;
        let monthZero = month > 9 ? month : "0" + month;
        let year = new Date(api.value(0)).getFullYear();
        let cellPointTime = year + "-" + monthZero + "-01";
        let cellPoint = api.coord(Date.parse(cellPointTime));
        let nbsp = month > 9 ? "       " : "        ";
        let text = nbsp + month + "月";

        let textOption = {
          type: "text",
          left: 0,
          position: [20, cellPoint[1] - 6],
          style: {
            text: [text],
            font: '11px Arial',
            stroke: "#888",
            fill: "#888"
          }
        };

        return textOption;
      };
      customSeires.push({
        type: "custom",
        z: 1,
        coordinateSystem: "calendar",
        renderItem: renderMonthLabel,
        dimensions: [null, { type: "ordinal" }],
        data: _this.dateRange,
        tooltip: {
          show: false
        }
      });
      var option = {
        tooltip: {},
        calendar: [
          {
            orient: "vertical",
            left: 75,
            top: 0,
            z: 0,
            splitLine: {
              lineStyle: {
                color: "#888888"
              }
            },
            itemStyle: {
              color: "transparent",
              borderWidth: 0.4
            },
            yearLabel: {
              show: false
            },
            monthLabel: {
              show: false
            },
            dayLabel: {
              firstDay: 1,
              nameMap: ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"],
              color: "#808080",
              fontWeight: 500,
              fontFamily: "Arial",
              margin: 12
            },
            cellSize: 65,
            range: [_this.dateRange[0], _this.dateRange[11]]
          }
        ],
        series: [...series, ...customSeires]
      };
      this.myChart.setOption(option);
    },
    /* 
       * 图表背景，显示图标月份的
       */
    initChartBg() {
      let _this = this;
      // 用于让图表自动滚动到当前月份的第一天位置
      function renderItem(params, api) {
        var cellPoint = api.coord(api.value(0));
        _this.scroller.scrollTo(0, -(cellPoint[1] - 40), 500);
      }
      this.myChartBg = echarts.init(document.getElementById("calendar-bg"));
      var optionBg = {
        calendar: [
          {
            orient: "vertical",
            left: 75,
            top: 0,
            z: 0,
            splitLine: {
              show: false,
              lineStyle: {
                color: "transparent"
              }
            },
            itemStyle: {
              color: "transparent",
              borderColor: "transparent"
            },
            yearLabel: {
              show: true
            },
            monthLabel: {
              nameMap: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ],
              margin: -290,
              align: "center",
              width: 530,
              color: "#eee",
              fontSize: 70
            },
            dayLabel: {
              firstDay: 1,
              nameMap: ["SUN", "MON", "TUE", "WEN", "THU", "FRI", "SAT"],
              color: "#808080",
              fontWeight: 500,
              fontFamily: "Arial",
              margin: 12
            },
            cellSize: 65,
            range: [_this.dateRange[0], _this.dateRange[11]]
          }
        ],
        series: [
          {
            // 当前日期，着重显示
            type: "custom",
            coordinateSystem: "calendar",
            data: [[new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-01"]], // 获取当前月的第一天，以便图表滚动至第一天的位置
            renderItem: renderItem
          }
        ]
      };
      this.myChartBg.setOption(optionBg);
    },
    /* 
       * 初始化日期显示范围，获取当前月的前6个月与后6个月,以便在图表中显示
       */
    initDateRange() {
      let currentMonth = new Date().getMonth() + 1; //当前月
      let currentYear = new Date().getFullYear(); // 当前年
      let months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; // 所有月份
      let monthDayRange = [
        "31",
        this._isLeapYear(currentYear),
        "31",
        "30",
        "31",
        "30",
        "31",
        "31",
        "30",
        "31",
        "30",
        "31"
      ]; // 月份对于的天数
      months.forEach((item, index) => {
        if (item === currentMonth) {
          // 当前月小于7时，首月年份应该是上一年的某月，末月为当前年的某月（6月除外）
          if (currentMonth < 7) {
            let monthTemp2 = months.slice(0, index + 1);
            monthTemp2.forEach((item, index) => {
              monthTemp2[index] = currentYear + "-" + item + "-01";
            });
            let monthTemp3 = months.slice(index + 1, index + 7);
            monthTemp3.forEach((item, index) => {
              monthTemp3[index] =
                currentYear + "-" + item + "-" + monthDayRange[item - 1];
            });
            let monthTemp1 = months.splice(
              12 - (6 - (index + 1)),
              6 - (index + 1)
            );
            monthTemp1.forEach((item, index) => {
              monthTemp1[index] = currentYear - 1 + "-" + item + "-01";
            });
            this.dateRange = monthTemp1.concat(monthTemp2).concat(monthTemp3);
          } else {
            // 当前月大于等于7时，首月年份应该是当前年的某月，末月为下一年的某月
            let monthTemp1 = months.slice(index - 5, index + 1);
            monthTemp1.forEach((item, index) => {
              monthTemp1[index] = currentYear + "-" + item + "-01";
            });
            let monthTemp2 = months.slice(index + 1, 12);
            monthTemp2.forEach((item, index) => {
              monthTemp2[index] =
                currentYear + "-" + item + "-" + monthDayRange[item - 1];
            });
            let monthTemp3 = months.slice(0, index - 5);
            monthTemp3.forEach((item, index) => {
              monthTemp3[index] =
                currentYear + 1 + "-" + item + "-" + monthDayRange[item - 1];
            });
            this.dateRange = monthTemp1.concat(monthTemp2).concat(monthTemp3);
          }
        }
      });
    },
    /* 
       * 判断当前年是否闰年，返回当前年的2月天数
       */
    _isLeapYear(year) {
      var term1 = year % 4 === 0;
      var term2 = year % 100 !== 0;
      var term3 = year % 400 === 0;
      if ((term1 && term2) || term3) {
        // 闰年
        return "29";
      } else {
        return "28";
      }
    },
    _formatData(data) {
      data = JSON.parse(JSON.stringify(data)); // data副本(深度复制)
      // 对data排序，跟this.colleges中的顺序一样
      if (this.colleges) { // 传入collegesData时（不传则为某所学校内部时间日历）
        let dataTemp = [];
        this.colleges.forEach((college, index) => {
          data.forEach(collegeItem => {
            if (collegeItem.id === college.college_id) {
              dataTemp[index] = collegeItem;
            }
          });
        });
        data = dataTemp;
      }

      // 筛选学校
      if (this.hideColleges.length) {
        data.forEach(dataItem => {
          if (this.hideColleges.includes(dataItem.id)) {
            dataItem.hide = true;
          } else {
            dataItem.hide = false;
          }
        });
      }

      // 筛选日期节点
      if (this.hideDeadlines.length) {
        data.forEach(dataItem => {
          dataItem.schedule = dataItem.schedule.filter(schedule => {
            return !this.hideDeadlines.includes(schedule.id);
          });
        });
      }

      let _this = this;
      /* 
         * 日期比较，用于sort排序(升序)
         */
      function compare(property) {
        return function(a, b) {
          let s = _this.completeMonth(a[property]);
          let t = _this.completeMonth(b[property]);
          var value1 = Date.parse(s);
          var value2 = Date.parse(t);
          return value1 - value2;
        };
      }
      let formatData = [];
      for (let index = 0; index < data.length; index++) {
        formatData.push([]);
        let dataItem = data[index];
        if (dataItem.hide) {
          continue;
        }
        dataItem.schedule.forEach(schedule => {
          let time = schedule.pivot.deadline + "";
          if (time.length < 3) {
            // 对于日期为两位数的，比如11，单独处理
            time = time.slice(0, -1).replace(/^0/, "");
          } else {
            time = time.slice(0, -2).replace(/^0/, "");
          }
          // 与已经初始化好的日期范围同步
          this.dateRange.forEach((dateRange, index) => {
            dateRange = _this.completeMonth(dateRange);
            let dateRangeMonth = new Date(dateRange).getMonth() + 1 + "";
            let dateRangeTime = schedule.pivot.deadline + "";
            if (dateRangeMonth === time) {
              if (dateRangeTime.length < 3) {
                // 对于日期为两位数的，比如11，单独处理
                time =
                  new Date(dateRange).getFullYear() +
                  "-" +
                  time +
                  "-" +
                  dateRangeTime.slice(-1);
              } else {
                time =
                  new Date(dateRange).getFullYear() +
                  "-" +
                  time +
                  "-" +
                  dateRangeTime.slice(-2);
              }
            }
          });
          formatData[index].push([
            time,
            schedule.id,
            dataItem.name_cn ? dataItem.name_cn : dataItem.name,
            index,
            schedule.name
          ]);
        });
        // 按时间先后排序
        formatData[index].sort(compare(0));
        // 进一步筛选，同一所大学，日期重复到，合并到一个时间点上
        let repeatTime = [];
        formatData[index] = formatData[index].filter((time, timeIndex) => {
          if (
            formatData[index].length === timeIndex + 1 ||
            formatData[index][timeIndex + 1][0] !== time[0]
          ) {
            time[4] = [...repeatTime, time[4]];
            repeatTime = [];
            return true;
          } else {
            repeatTime.push(time[4]);
          }
        });
      }
      return formatData;
    },
    /* 
      * 补全日期，2018-9-9 => 2018-09-09
      * ie中对日期不规范写法不兼容
      */
    completeMonth(str) {
      if (str == 0) return
      
      let m = str.match(/\-(\d+)\-/)[1];
      let mt = "";
      let d = str.match(/\-(\d+)$/)[1];
      let dt = "";
      if (m.length < 2) {
        mt = "-0" + m + "-";
      } else {
        mt = "-" + m + "-";
      }
      if (d.length < 2) {
        dt = "-0" + d;
      } else {
        dt = "-" + d;
      }
      str = str.replace(/\-(\d+)\-/, mt);
      str = str.replace(/\-(\d+)$/, dt);
      return str;
    }
  },
  components: {}
};
</script>

<style lang="scss" scoped>
.calendar-axis {
  background: #fff;
  font-size: 0;
  .college {
    .calendar-label {
      left: 30px;
    }
    .calendar-scroll-container {
      left: 56px;
    }
    .deadline-list {
      margin-left: 120px;
    }
  }
}
.calendar-label {
  position: absolute;
  left: 124px;
  top: 0;
  width: 560px;
  height: 30px;
  padding-left: 100px;
  background: #fff;
  z-index: 100;
  font-size: 12px;
  color: #888;
  margin: 0;
  li {
    float: left;
    width: 65px;
    text-align: center;
    list-style: none;
  }
}
.calendar-scroll-container {
  position: relative;
  display: inline-block;
  width: 532px;
  height: 2100px;
  margin-bottom: 100px;
  z-index: 10;
  top: 30px;
  .calendar-scroll-box {
    width: 100%;
    height: 3480px;
    position: relative;
    z-index: 10000;
    #calendar {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
    #calendar-bg {
      position: absolute;
      left: 0px;
      top: 0px;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
  }
}
.time-container {
  position: relative;
  overflow: hidden;
}
.college-list {
  display: inline-block;
  vertical-align: top;
  width: 150px;
  padding-top: 24px;
  padding-left: 0;
  .no-college {
    font-size: 12px;
    padding-left: 14px;
    height: 45px;
    line-height: 1.3;
    color: #888;
  }
  .college-item {
    position: relative;
    // height: 45px;
    padding-left: 14px;
    line-height: 1.3;
    font-size: 14px;
    transition: all 0.2s;
    margin-bottom: 5px;
    list-style: none;
    &.not-selected i {
      background: #eee !important;
    }
    .border-left {
      position: absolute;
      left: 0;
      top: 9px;
      display: inline-block;
      width: 4px;
      height: 25px;
    }
    .college-box {
      display: table-cell;
      vertical-align: middle;
      height: 45px;
      cursor: pointer;
      color: #8b979d;
    }
  }
}
.deadline-list {
  display: inline-block;
  vertical-align: top;
  padding-top: 24px;
  margin-left: 36px;
  width: 134px;
  font-size: 14px;
  .deadline {
    margin-bottom: 30px;
    font-size: 0;
    cursor: pointer;
    .deadline-icon {
      display: inline-block;
      width: 14px;
      height: 14px;
      margin-right: 4px;
      margin-top: 3px;
      vertical-align: top;
      &.not-selected{
        opacity: 0;
        visibility: hidden;
      }
    }
    .deadline-text {
      display: inline-block;
      width: 116px;
      line-height: 1.4em;
      margin: 0;
      padding: 0;
      font-size: 14px;
      color: #8b979d;
    }
  }
}
</style>
