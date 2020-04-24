const db = wx.cloud.database()
const util = require('../../utils/util.js')

Page({
    data: {
        hasEmptyGrid: false,
        showPicker: false
    },

    onLoad: async function (options) {

        const date = new Date();
        const curYear = date.getFullYear();
        const curMonth = date.getMonth() + 1;
        const weeksCh = ['日', '一', '二', '三', '四', '五', '六'];
        this.calculateEmptyGrids(curYear, curMonth);
        let days = this.calculateDays(curYear, curMonth);
        this.setData({
            curYear,
            curMonth,
            weeksCh
        });
        this.initRecords(days, curYear, curMonth)
    },

    async initRecords(days, year, month) {
        let detail = await this.getSignRcords()
        let signTotal = detail.length
        let signTime = signTotal && detail[0].sign_time
        let continueDays = signTotal && detail[0].continue_sign_days
        let records = this.convertToObject(detail)
        this.signRecord(records, days, year, month)

        let isSameDay = util.isSameDay(signTime, Date.now())

        this.setData({
            signTotal,
            signed: isSameDay,
            continueDays
        })
    },

    async getSignRcords() {
        let {
            data
        } = await db.collection('sign').orderBy("sign_time", "desc").get()



        for (let item in data) {
            data[item].sign_time = util.formatDate(data[item].sign_time, "/")
        }
        wx.setStorageSync('signDetail', data)
        return data

    },

    getThisMonthDays(year, month) {
        return new Date(year, month, 0).getDate();
    },

    getFirstDayOfWeek(year, month) {
        return new Date(Date.UTC(year, month - 1, 1)).getDay();
    },

    calculateEmptyGrids(year, month) {
        const firstDayOfWeek = this.getFirstDayOfWeek(year, month);
        let empytGrids = [];
        if (firstDayOfWeek > 0) {
            for (let i = 0; i < firstDayOfWeek; i++) {
                empytGrids.push(i);
            }
            this.setData({
                hasEmptyGrid: true,
                empytGrids
            });
        } else {
            this.setData({
                hasEmptyGrid: false,
                empytGrids: []
            });
        }
    },

    convertToObject(array, key) {
        let obj = {}
        array.forEach((item) => {
            obj[item.sign_time] = item
        })

        return obj
    },

    calculateDays(year, month) {
        let days = [];

        const thisMonthDays = this.getThisMonthDays(year, month);

        for (let i = 1; i <= thisMonthDays; i++) {
            days.push({
                day: i,
                choosed: false
            });
        }

        return days
    },



    handleCalendar(e) {
        const handle = e.currentTarget.dataset.handle;
        const curYear = this.data.curYear;
        const curMonth = this.data.curMonth;
        if (handle === 'prev') {
            let newMonth = curMonth - 1;
            let newYear = curYear;
            if (newMonth < 1) {
                newYear = curYear - 1;
                newMonth = 12;
            }

            let days = this.calculateDays(newYear, newMonth);
            this.calculateEmptyGrids(newYear, newMonth);
            let detail = wx.getStorageSync('signDetail')
            let records = this.convertToObject(detail)

            this.signRecord(records, days, newYear, newMonth)


            this.setData({
                curYear: newYear,
                curMonth: newMonth
            });
        } else {
            let newMonth = curMonth + 1;
            let newYear = curYear;
            if (newMonth > 12) {
                newYear = curYear + 1;
                newMonth = 1;
            }


            let days = this.calculateDays(newYear, newMonth);
            this.calculateEmptyGrids(newYear, newMonth);
            let detail = wx.getStorageSync('signDetail')
            let records = this.convertToObject(detail)

            this.signRecord(records, days, newYear, newMonth)

            this.setData({
                curYear: newYear,
                curMonth: newMonth
            });
        }
    },

    signRecord(records, days, year, month) {

        month = util.formatNumber(month)

        if (Object.keys(records).length) {
            days.forEach((item, index, array) => {
                let day = util.formatNumber(item.day)
                array[index].ledou = records[`${year}/${month}/${day}`] && records[`${year}/${month}/${day}`].ledou
                array[index].choosed = Boolean(records[`${year}/${month}/${day}`])
            })
        }

        this.setData({
            days
        })
    },

    sign() {
        this.setData({
            sign: true
        })
        wx.cloud.callFunction({
                name: "sign"
            }).then(res => {

                let {
                    days,
                    curMonth,
                    curYear
                } = this.data

                this.initRecords(days, curYear, curMonth)

                this.setData({
                    signed: true
                })
                wx.showModal({
                    title: "签到提醒",
                    content: "签到成功，天天坚持哦",
                    showCancel: false
                })
            })
            .catch((error) => {
                console.log(error)
                this.setData({
                    sign: false
                })
            })

    },

    onShareAppMessage: function () {

    }
})