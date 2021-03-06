/*封装$*/
window.$=HTMLElement.prototype.$=
  function(selector){
    var elems=
      (this==window?document:this)
        .querySelectorAll(selector);
    return elems.length==0?null:
           elems.length==1?elems[0]:
                           elems;
  }
/*广告图片数组*/
var images=[
{"i":0,"img":"images/index/banner_01.jpg"},
{"i":1,"img":"images/index/banner_02.jpg"},
{"i":2,"img":"images/index/banner_03.jpg"},
{"i":3,"img":"images/index/banner_04.jpg"},
{"i":4,"img":"images/index/banner_05.jpg"},
];
var slider={
  LIWIDTH:0,//保存每个li的宽度
  DISTANCE:0,//保存轮播移动的总距离
  DURATION:1000,//保存轮播的总时间
  STEPS:100,//保存轮播的总步数
  interval:0,//保存每步轮播的时间间隔
  step:0,//保存每步轮播的步长
  timer:null,//保存当前轮播的序号
  moved:0,//保存本次轮播已经移动的步数
  WAIT:3000,//保存自动轮播之间的时间间隔
  canAuto:true,//保存能否启动自动轮播
  init:function(){
    
    //计算interval=DURATION/STEPS
    this.interval=
      this.DURATION/this.STEPS;
    //获得id为slider的元素计算后的width属性，转为浮点数，保存在LIWIDTH属性中
    this.LIWIDTH=parseFloat(
      getComputedStyle($("#slider")).width
    );
    this.updateView();//更新页面
    var me=this;//留住this
    //为id为indexs的元素绑定鼠标进入事件为
    $("#indexs").addEventListener("mouseover",
      function(e){
        var target=e.target;//获得目标元素
        //如果target是LI，且target的class不是hover
        if(target.nodeName=="LI"&&
            target.className!="hover"){
          clearTimeout(me.timer);//停止当前动画
          me.updateView();//更新界面
          me.timer=null;
          me.moved=0;
          $("#imgs").style.left="";
          //target的内容-#indexs下的class为hover的li的内容，保存在变量n中
          me.move(target.innerHTML-
            $("#indexs>li.hover").innerHTML);
        }
      });
    $("#slider").addEventListener(
      "mouseover",function(){me.canAuto=false;} 
    );
    $("#slider").addEventListener(
      "mouseout",function(){me.canAuto=true;}  
    );
    this.autoMove();//启动自动轮播
  },
  autoMove:function(){//启动自动轮播
    this.timer=setTimeout(//启动一次性定时器
      function(){
        if(this.canAuto){//如果canAuto是true
          this.move(1);//调用move，移动1次
        }else{
          this.autoMove();//重新等待
        }
      }.bind(this),this.WAIT
    );
  },
  move:function(n){//启动一个轮播
//n*LIWIDTH，保存在DISTANCE属性中
    this.DISTANCE=n*this.LIWIDTH;
//DISTANCE/STEPS，保存在属性step中
    this.step=this.DISTANCE/this.STEPS;
    if(n<0){//如果是右移
      //删除images结尾的n个元素,拼接到images开头,将结果保存回images
      images=images.splice(images.length+n,-n)
                    .concat(images);
      this.updateView();//更新页面
      //设置id为imgs的元素的left为n*LIWIDTH
      $("#imgs").style.left=n*this.LIWIDTH+"px";
    }
//启动一次性定时器，设置任务为moveStep(提前绑定this),间隔为interval,将序号保存在timer中
    this.timer=setTimeout(
      this.moveStep.bind(this,n),this.interval);
  },
  moveStep:function(n){//移动一步
//获得id为imgs的元素计算后的left，转为浮点数保存在变量left中
    var left=parseFloat(
      getComputedStyle($("#imgs")).left
    );
//设置id为imgs的元素的left为left-step
    $("#imgs").style.left=left-this.step+"px";
    this.moved++;//moved+1
    //如果moved<STEPS,就启动一次性定时器
    if(this.moved<this.STEPS){
      this.timer=setTimeout(
        this.moveStep.bind(this,n),this.interval);
    }else{
      this.timer=null;
      this.moved=0;
      if(n>0){//左移
        //删除images开头的n个元素，将删除的结果拼接到images结尾，将结果保存回images
        images=images.concat(
                  images.splice(0,n));
        this.updateView();//更新界面
      }
      //将id为imgs的元素的left清除
      $("#imgs").style.left="";
      this.autoMove();//启动自动轮播:
    }
  },
  updateView:function(){//按数组更新页面
    //遍历images数组,同时声明空字符串html1和html2
    for(var i=0,html1="",html2="";
        i<images.length;
        i++){
      //向html1中拼接:
      //<li><img src="当前元素的img"></li>
      html1+='<li><img src="'+
        images[i].img+'"></li>';
      console.log(images[i].i);
      //向html2中拼接:<li>i+1</li>
      html2+="<li>"+(i+1)+"</li>";
    }//(遍历结束)
    //设置id为imgs的元素的内容为html1
    $("#imgs").innerHTML=html1;
    //设置id为imgs的元素的宽为:
      //images数组的元素个数*LIWIDTH
    $("#imgs").style.width=
      images.length*this.LIWIDTH+"px";
    //设置id为indexs的元素内容为html2
    $("#indexs").innerHTML=html2;
    //找到id为indexs下的和images数组中第1个元素的i属性对应的li，设置其class为hover
    $("#indexs>li:nth-child("
        +(images[0].i+1)+")")
          .className="hover";
  },
  
}
window.addEventListener(
  "load",function(){slider.init();}
);