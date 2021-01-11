<template>
  <view>
    <view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
      <cu-custom bgcolor="bg-gradual-pink" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">历史上的今天</block>
      </cu-custom>
	  <!-- 轮播 -->
			<swiper class="screen-swiper square-dot"  :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" :style="[{animation: 'show 0.2s 1'}]">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item.url" mode="aspectFill" v-if="item.type=='image'" ></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
				</swiper-item>
			</swiper>
      <uni-collapse class="cu-list menu" v-for="(item, index) in historys" :key="index" accordion="true">
        <uni-collapse-item :title="item.no+':'+item.title" :index="item.index ">
          <image v-if="item.pic" :src="imgPath(item.pic)" mode="aspectFit"></image>
          <view style="padding: 30rpx; text-indent:20px; letter-spacing:1px;">{{item.content}}</view>
        </uni-collapse-item>
      </uni-collapse>
    </view>
   <view>
     <uni-load-more :status="status" :icon-size="16" :content-text="contentText" />
   </view>
  </view>
 
</template>

<script>
import api from "@/api/api.js";
import uniCollapse from "@dcloudio/uni-ui/lib/uni-collapse/uni-collapse";
import uniCollapseItem from "@dcloudio/uni-ui/lib/uni-collapse-item/uni-collapse-item";
import uniLoadMore from "components/uni-load-more/uni-load-more";
import uniTitle from "@dcloudio/uni-ui/lib/uni-title/uni-title.vue";
export default {
  components: {
    uniCollapse,
    uniCollapseItem,
    uniLoadMore
  },
  // props: {
  //   loadding: false,
  //   pullUpOn: false,
  // },
  data() {
    return {
	   swiperList: [
			{id:1,type: 'image',url: '/static/banner/banner1.png', link: ''},
			{id:2,type: 'image',url: '/static/banner/banner2.jpg', link: ''},
			{id:3,type: 'image',url: '/static/banner/banner3.jpg', link: ''},
			{id:4,type: 'image',url: '/static/banner/banner4.jpg', link: ''},
		],
      historys: {
        title: "",
      },
      showLoadMore: true,
      contentText: {
      	contentdown: '上拉加载更多',
      	contentrefresh: '加载中',
      	contentnomore: '没有更多'
      },
	  reload: false,
	  last_id: "",
	  status: 'more',
      modalName: null,
      newCurrent: 1,
      newPagesSize: 10,
      length: 0,
      url: "/generic/historys",
    };
  },
  onLoad() {
	    setTimeout(() => {
	                         this.initData(1, 10);
	                      }, 1000);
   
  },
 // 监听页面卸载
  onUnload() {
	  debugger
    (this.newCurrent = 0),
      (this.historys = []),
	  (this.showLoadMore = false);
	  this.loadMoreText = "加载更多";
  },
  // 上拉加载
  onReachBottom() {
	  debugger
	      this.newCurrent += 1;
		  if(this.newCurrent>this.length){
			   this.status = 'noMore';
		  }else{
			  this.status = 'more';
			  this.setListData(this.newCurrent, this.newPagesSize);
		  }
	  },
  // 下拉刷新
  onPullDownRefresh() {
	this.reload = true;
	this.last_id = '';
    this.setListData(1,10);
  },
  methods: {
    imgPath: function (path) {
      if (path && path.indexOf("http") >= 0) {
        return path;
      }
      return this.siteHost + path;
    },
    initData(nowCurrent, nowSize) {
		let that = this
      setTimeout(() => {
        this.$http
          .get(
            "/generic/historys?pageNo=" + nowCurrent + "&pageSize=" + nowSize
          )
          .then((res) => {
            console.log("data", res);
            if (res.data.success) {
			  let result = 	res.data.result;
              that.historys = result.records;
			  that.length =  result.pages;
			 that.last_id =  that.historys[result.pages - 1].id;
            }
          })
          .catch((e) => {
            console.log("请求错误", e);
          });
      }, 3000);
    },
    setListData(nowCurrent, nowSize) {
		let that = this;
	  if (this.last_id) {
	  	//说明已有数据，目前处于上拉加载
	  	this.status = 'loading';
	  	this.nowSize = 10;
	  }
      this.$http
        .get("/generic/historys?pageNo=" + nowCurrent + "&pageSize=" + nowSize)
        .then((res) => {
          console.log("data", res);
          if (res.data.success) {
			let result = res.data.result;
			that.historys = that.reload ? result.records : this.historys.concat(result.records);
			that.length =  result.pages;
			that.last_id = that.historys[result.pages - 1].id;
			that.reload = false;
          }
        })
        .catch((e) => {
          console.log("请求错误", e);
        });
    },
  },
};
</script>

<style>
.page {
  height: 100vh;
  width: 100vw;
}

.page.show {
  overflow: hidden;
}

.switch-sex::after {
  content: "\e716";
}

.switch-sex::before {
  content: "\e7a9";
}

.switch-music::after {
  content: "\e66a";
}

.switch-music::before {
  content: "\e6db";
}


</style>
