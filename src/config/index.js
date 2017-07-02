import Vue from 'vue'
import vueConfig from 'vue-config'

const configs = {
  website: '睿&萌',
  bridegroom: '夏睿',
  bride: '张萌',
  bridegroom_short: '睿',
  bride_short: '萌',
  beian: '皖ICP备17010992号-1',
  page: {
    homepage: '一起开始的旅程',
    wedding: '结婚典礼',
    guestbook: '留言板',
    contact: '联系方式'
  },
  pageShort: {
    homepage: '睿&萌',
    wedding: '婚礼',
    guestbook: '留言',
    contact: '联系'
  },
  title: {
    wedding: '婚礼',
    schedule: '日程安排',
    attend: '参加婚礼',
    notes: '注意事项'
  },
  wedding: {
    date: '2017年7月28日',
    date_lunar: '丁酉年闰六月初六',
    location: '安徽省巢湖市'
  },
  schedule: [
    {
      title: '迎亲',
      time: '8:00 - 11:00',
      location: {
        from: '黄麓镇张疃村',
        to: '巢湖市区'
      }
    },
    {
      title: '婚礼仪式及午宴',
      time: '11:00 - 14:00',
      location: '喜庆楼运升酒店'
    },
    {
      title: '自由活动',
      time: '14:00 -'
    }
  ],
  contact: [
    {
      icon: 'envelope',
      text: 'harrysummer@163.com'
    },
    {
      icon: 'envelope',
      text: 'zmeng_uibe@126.com'
    },
    {
      icon: 'phone',
      text: '+86-15311419424'
    }
  ],
  map: {
    key: 'VXaSYUe6vkqcCiKIy7CFEwN4BmFGzQCF',
    marker: {
      lng: 117.862791,
      lat: 31.612035
    },
    zoom: 9,
    theme: [
      {
        'featureType': 'water',
        'elementType': 'all',
        'stylers': { 'color': '#216eb4' }
      },
      {
        'featureType': 'land',
        'elementType': 'all',
        'stylers': { 'color': '#86c494' }
      },
      {
        'featureType': 'highway',
        'elementType': 'geometry',
        'stylers': {
          'color': '#ffffff',
          'weight': '0.4'
        }
      },
      {
        'featureType': 'highway',
        'elementType': 'labels',
        'stylers': { 'visibility': 'off' }
      },
      {
        'featureType': 'label',
        'elementType': 'all',
        'stylers': {}
      }
    ]
  }
}

Vue.use(vueConfig, configs)
export default configs
