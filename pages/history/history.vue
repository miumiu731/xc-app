<template>
  <view>
    <view :scroll-y="modalName==null" class="page" :class="modalName!=null?'show':''">
      <cu-custom bgcolor="bg-gradual-pink" :isBack="true">
        <block slot="backText">返回</block>
        <block slot="content">历史上的今天</block>
      </cu-custom>
	  <!-- 轮播 -->
	  <view  class="page_header">
			<swiper class="screen-swiper square-dot"  :indicator-dots="true" :circular="true"
			 :autoplay="true" interval="5000" duration="500" :style="[{animation: 'show 0.2s 1'}]">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item.url"  mode="scaleToFill" v-if="item.type=='image'"  ></image>
					<video :src="item.url" autoplay loop muted :show-play-btn="false" :controls="false" objectFit="cover" v-if="item.type=='video'"></video>
				</swiper-item>
			</swiper>
      </view>
	  <view class="page_list">
      <uni-collapse  class="cu-list menu" v-for="(item, index) in (historys || [])" :key="index" accordion="true">
			<uni-collapse-item :title="item.no+':'+item.title" :index="item.index ">
			 <image v-if="item.pic" :src="imgPath(item.pic)" mode="aspectFit"></image>
			  <view style="padding: 30rpx; text-indent:20px; letter-spacing:1px;">{{item.content||''}}</view>
			</uni-collapse-item>
      </uni-collapse>
</view>
    </view>
   <view  class="text-bottom">
     <uni-load-more :bottom="0" :status="status" :icon-size="16" :content-text="contentText" />
   </view>
   <view>
   <y-fab :bottom="140" :right="40" :btnList="fabList" @click="handleFab" />
   </view>
  </view>
 
</template>

<script>
import apiHistoryService from "@/api/historyApi.js";
import uniCollapse from "@dcloudio/uni-ui/lib/uni-collapse/uni-collapse";
import uniCollapseItem from "@dcloudio/uni-ui/lib/uni-collapse-item/uni-collapse-item";
import uniLoadMore from "components/uni-load-more/uni-load-more";
import yFab from "components/y-Fab/y-Fab.vue"; 
import uniTitle from "@dcloudio/uni-ui/lib/uni-title/uni-title.vue";
export default {
  components: {
    uniCollapse,
    uniCollapseItem,
    uniLoadMore,
	yFab
  },

  data() {
    return {
	   swiperList: [],
      historys: [],
      showLoadMore: true,
      contentText: {
      	contentdown: '上拉加载更多',
      	contentrefresh: '加载中',
      	contentnomore: '没有更多'
      },
	  //fab的设置
	  fabList: [
	  	{
	  		bgColor: '#16C2C2',
	  		text: '发布',
	  		fontSize: 28,
	  		color: '#fff'
	  	},
	  	{
	  		bgColor: '#37b59d',
	  		text: '分享',
	  		fontSize: 28,
	  		color: '#fff'
	  	}
	  ],
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
      this.listData(1, 10);
	               
  },
  mounted () {
      window.addEventListener('scroll', this.handleScroll)
  },
  onHide() {
      window.removeEventListener("scroll", this.handleScroll);
  },
  // 上拉加载
  onReachBottom() {
	      this.newCurrent += 1;
		  if(this.newCurrent>this.length){
			   this.status = 'noMore';
		  }else{
			  this.status = 'more';
			  this.listData(this.newCurrent, this.newPagesSize);
		  }
	  },
  // 下拉刷新
  onPullDownRefresh() {
	this.reload = true;
	this.last_id = '';
    this.setListData(1,10);
  },
  methods: {
	  handleScroll () {
	          let scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop
	          let offsetTop = document.querySelector('.dynamic-fixed-item').offsetTop
	          if (scrollTop > offsetTop) {
	          this.isFixed = true
	          } else {
	          this.isFixed = false
	          }
	    },
    imgPath: function (path) {
      if (path && path.indexOf("http") >= 0) {
        return path;
      }
      return this.siteHost + path;
    },
    
    listData(nowCurrent, nowSize) {
		let that = this;
	  if (this.last_id) {
	  	//说明已有数据，目前处于上拉加载
	  	this.status = 'loading';
	  	this.nowSize = 10;
	  }
     apiHistoryService.getHistoryList(nowCurrent, nowSize)
        .then((res) => {
          console.log("data", res);
          if (res.data.success) {
			let result = res.data.result;
			that.historys = that.reload ? result.records : this.historys.concat(result.records);
			that.length =  result.pages;
			that.last_id = that.historys[result.pages - 1].id;
			let objArr=[];
			for(let i=0; i<that.historys.length;i++){
				if(that.historys[i].pic){
					let obj ={}
					obj.url = that.historys[i].pic
					obj.id = that.historys[i].id
					obj.title = that.historys[i].title
					obj.type ='image'					
					objArr.push(obj)
				}
			
			}
			that.swiperList = objArr;
			that.reload = false;
          }
        })
        .catch((e) => {
          console.log("请求错误", e);
        });
    },
	//点击右下角tab按钮
	handleFab(e) {
		let index = e.index;
		switch (index) {
			case 0:
				uni.navigateTo({
					url: '../push/push'
				});
				break;
			case 1:
				console.log(1);
				break;
		}
	}
  },
};
</script>

<style>
.page {
  height: 100vh;
  width: 100vw;
}
.page_header {
	position: fixed;
	  top: 0;
	  left: 0;
	  width: 100%;
	  background-color: #fff;
	  padding-top: 60rpx;
	  z-index: 2;
}
.page_list{
	padding-top: 370rpx; 
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
.text-bottom {
		position: fixed;  
		bottom: 0rpx;
		left: 0rpx;
		right: 0rpx;
	}

</style>
