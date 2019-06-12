<template>
  <div id="app">
    <calendar-axis
      :axisData="axisData"
      :deadlines="projectData"
    ></calendar-axis>
  </div>
</template>

<script>
import CalendarAxis from './components/calendarAxis/calendar-axis.vue'
export default {
  name: 'app',
  data () {
    return {
      axisData: [
        {
          "id": 1054,
          "name": "Westminster College",
          "name_cn": null,
          "badge": null,
          "cover": "cover.jpg",
          "country": "USA",
          "state": "UT",
          "area": 7,
          "state_id": 253,
          "city": "Salt Lake City",
          "created_at": "2017-12-07 16:03:26",
          "updated_at": "2018-09-03 10:04:40",
          "type": "regional-universities-west",
          "pivot": {
            "student_id": 94,
            "college_id": 1054
          },
          "schedule": [
            {
              "id": 12,
              "name": "托福建议考试时间",
              "time": "申请截止日期前6个月",
              "num": "6",
              "pivot": {
                "deadline": "0216"
              }
            },
            {
              "id": 14,
              "name": "雅思建议考试时间",
              "time": "申请截止日期前6个月",
              "num": "6",
              "pivot": {
                "deadline": "0216"
              }
            },
            {
              "id": 16,
              "name": "SAT建议考试时间",
              "time": "申请截止日期前6个月",
              "num": "6",
              "pivot": {
                "deadline": "0216"
              }
            },
            {
              "id": 18,
              "name": "ACT建议考试时间",
              "time": "申请截止日期前6个月",
              "num": "6",
              "pivot": {
                "deadline": "0216"
              }
            },
            {
              "id": 20,
              "name": "GRE建议考试时间",
              "time": "申请截止日期前6个月",
              "num": "6",
              "pivot": {
                "deadline": "0216"
              }
            },
            {
              "id": 22,
              "name": "GMAT建议考试时间",
              "time": "申请截止日期前6个月",
              "num": "6",
              "pivot": {
                "deadline": "0216"
              }
            },
            {
              "id": 10,
              "name": "奖金通知日期",
              "pivot": {
                "college_id": 1054,
                "schedule_id": 10,
                "id": 2689,
                "deadline": 301
              }
            },
            {
              "id": 11,
              "name": "托福最晚考试时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 13,
              "name": "雅思最晚考试时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 15,
              "name": "SAT最晚考试时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 17,
              "name": "ACT最晚考试时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 19,
              "name": "GRE最晚考试时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 21,
              "name": "GMAT最晚考试时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 23,
              "name": "WES认证最晚时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 25,
              "name": "标化成绩寄送最晚时间",
              "time": "申请截止日期前1个月",
              "num": "1",
              "pivot": {
                "deadline": "0716"
              }
            },
            {
              "id": 24,
              "name": "语言成绩寄送最晚时间",
              "time": "申请截止日期前两周",
              "num": "0.5",
              "pivot": {
                "deadline": "0802"
              }
            },
            {
              "id": 1,
              "name": "常规招生截止日期",
              "pivot": {
                "college_id": 1054,
                "schedule_id": 1,
                "id": 4736,
                "deadline": 816
              }
            }
          ]
        },
        {
          "id": 1303,
          "name": "The Citadel",
          "name_cn": null,
          "badge": null,
          "cover": "cover.jpg",
          "country": "USA",
          "state": "SC",
          "area": 3,
          "state_id": 249,
          "city": "Charleston",
          "created_at": "2017-12-07 16:05:34",
          "updated_at": "2018-09-03 10:04:40",
          "type": "regional-universities-south",
          "pivot": {
            "student_id": 94,
            "college_id": 1303
          },
          "schedule": [
            {
              "id": 1,
              "name": "常规招生截止日期",
              "pivot": {
                "college_id": 1303,
                "schedule_id": 1,
                "id": 4514,
                "deadline": 101
              }
            },
            {
              "id": 10,
              "name": "奖金通知日期",
              "pivot": {
                "college_id": 1303,
                "schedule_id": 10,
                "id": 3177,
                "deadline": 401
              }
            },
            {
              "id": 3,
              "name": "接受录取通知书日期",
              "pivot": {
                "college_id": 1303,
                "schedule_id": 3,
                "id": 3124,
                "deadline": 501
              }
            }
          ]
        }
      ],
      projectData: [
        {
          "id": 1,
          "name": "常规招生截止日期"
        },
        {
          "id": 3,
          "name": "接受录取通知书日期"
        },
        {
          "id": 10,
          "name": "奖金通知日期"
        },
        {
          "id": 11,
          "name": "托福最晚考试时间"
        },
        {
          "id": 12,
          "name": "托福建议考试时间"
        },
        {
          "id": 13,
          "name": "雅思最晚考试时间"
        },
        {
          "id": 14,
          "name": "雅思建议考试时间"
        },
        {
          "id": 15,
          "name": "SAT最晚考试时间"
        },
        {
          "id": 16,
          "name": "SAT建议考试时间"
        },
        {
          "id": 17,
          "name": "ACT最晚考试时间"
        },
        {
          "id": 18,
          "name": "ACT建议考试时间"
        },
        {
          "id": 19,
          "name": "GRE最晚考试时间"
        },
        {
          "id": 20,
          "name": "GRE建议考试时间"
        },
        {
          "id": 21,
          "name": "GMAT最晚考试时间"
        },
        {
          "id": 22,
          "name": "GMAT建议考试时间"
        },
        {
          "id": 23,
          "name": "WES认证最晚时间"
        },
        {
          "id": 24,
          "name": "语言成绩寄送最晚时间"
        },
        {
          "id": 25,
          "name": "标化成绩寄送最晚时间"
        }
      ]
    }
  },
  components: {
    CalendarAxis
  }
}
</script>

<style lang="scss">
</style>
