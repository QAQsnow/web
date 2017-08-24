window.addEventListener(
  "load",function(){
    elevator.init();
  }
);
//求任意elem距页面顶部的总距离
function getElemTop(elem){
  //声明一个sum,初始化为elem.offsetTop
  var sum=elem.offsetTop;
  //循环:elem.offsetParent!=null
  while(elem.offsetParent!=null){
    //获得elem.offsetParent.offsetTop，累加s到sum上
    sum+=elem.offsetParent.offsetTop;
    //将elem替换为其offsetParent
    elem=elem.offsetParent;
  }//(循环结束)
  return sum
}
var elevator={
  FHEIGHT:0,//保存每个楼层的高度
  UPLEVEL:0,//保存亮灯区域的上限
  DOWNLEVEL:0,//保存亮灯区域的下限
  DISTANCE:0,
  DURATION:1000,
  STEPS:100,
  interval:0,
  step:0,
  timer:null,
  moved:0,
  init:function(){
    this.interval=
      this.DURATION/this.STEPS;
//获得id为f1的元素计算后的样式，保存在变量style中
    var style=getComputedStyle($("#f1"));
//将style的height转为浮点数后，+style的marginBottom转为浮点数，结果保存在FHEIGHT属性中
    this.FHEIGHT=
      parseFloat(style.height)
      +parseFloat(style.marginBottom);
//(innerHeight-FHEIGHT)/2保存在UPLEVEL属性
    this.UPLEVEL=
      (innerHeight-this.FHEIGHT)/2
//UPLEVEL+FHEIGHT保存在DOWNLEVEL属性中
    this.DOWNLEVEL=
      this.UPLEVEL+this.FHEIGHT;
//为window绑定页面滚动事件为light方法(提前绑定this)
    window.addEventListener(
      "scroll",this.light.bind(this)  
    );

   //为id为elevator下的ul绑定鼠标进入事件
    $("#elevator>ul").addEventListener(
      "mouseover",
      function(e){
        //获得目标元素
        var target=e.target;
        //如果target不是UL时
        if(target.nodeName!="UL"){
          //如果target是a
            //将target换成target的父元素
          target.nodeName=="A"&&
            (target=target.parentNode);
          //target下找第1个子元素a，隐藏
          target.$("a:first-child")
                .style.display="none";
          //target下找第2个子元素a，显示
          target.$("a:last-child")
                .style.display="block";
        }
      }
    );
   //为id为elevator下的ul绑定鼠标移出事件
    $("#elevator>ul").addEventListener(
      "mouseout",
      function(e){
        //获得目标元素
        var target=e.target;
        //如果target不是UL时
        if(target.nodeName!="UL"){
          //如果target是a
            //将target换成target的父元素
          target.nodeName=="A"&&
            (target=target.parentNode);
          //获得target下第一个a元素的内容，转为整数，保存在变量f中
          var f=parseInt(
            target.firstElementChild
                  .innerHTML
          );
          //查找id为"f"+f的元素下的header下的span，保存在变量span中
          var span=
            $("#f"+f+">header>span");
          //如果span的class不是hover
          if(span.className!="hover"){
            //target下找第1个子元素a，隐藏
            target.$("a:first-child")
                  .style.display="block";
            //target下找第2个子元素a，显示
            target.$("a:last-child")
                  .style.display="none";
          }
        }
      }
    );
    
    //为id为elevator下的ul绑定单击事件
    $("#elevator>ul").addEventListener(
      "click",this.scrollTo.bind(this)
    );
  },
  light:function(){//楼层点亮
    //查找class为floor下的header下的直接子元素span，保存在变量spans中
    var spans=
      $(".floor>header>span");
    //获得页面滚动的距离，保存在变量scrollTop
    var scrollTop=document.body.scrollTop;
    //遍历spans中每个span
    for(var i=0;i<spans.length;i++){
      //获得当前span距页面顶部的总距离，保存在变量elemTop中
      var elemTop=getElemTop(spans[i]);
      //找到id为elevator下的ul下的第i+1个li，保存在变量li中
      var li=
        $("#elevator>ul>li:nth-child("
                              +(i+1)+")");
      //如果elemTop>scrollTop+UPLEVEL
          //且elemTop<=scrollTop+DOWNLEVEL
      if(elemTop>=scrollTop+this.UPLEVEL
        &&
        elemTop<scrollTop+this.DOWNLEVEL)
      {//设置当前span的class为hover
        spans[i].className="hover";
        //在li下找第1个子元素a，隐藏
        li.$("a:first-child")
          .style.display="none";
        //在li下找第2个子元素a，显示
        li.$("a:last-child")
          .style.display="block";
      }else{//否则,清除当前span的class
        spans[i].className="";
        //在li下找第1个子元素a，显示
        li.$("a:first-child")
          .style.display="block";
        //在li下找第2个子元素a，隐藏
        li.$("a:last-child")
          .style.display="none";
      }
    }
    //查找class为floor下的header下的class为hover的span，保存在变量span中
    var span=
      $(".floor>header>span.hover");
    //设置id为elevator的元素，如果span不是null，就显示，否则就隐藏
    $("#elevator").style.display=
      span!=null?"block":"none";
  },
  scrollTo:function(e){
    if(this.timer==null){
      var target=e.target;//获得目标元素
      //如果target的class为etitle
      if(target.className=="etitle"){
        //获得target前一个a元素的内容，转为整数，保存在变量f中
        var f=parseInt(
          target.previousElementSibling
                .innerHTML
        );
        //查找id为"f"+f的元素下的header下的span，保存在变量span中
        var span=$("#f"+f+">header>span");
        //获得span距页面顶部的高度elemTop
        var elemTop=getElemTop(span);
        //求滚动的总距离
        this.DISTANCE=
          elemTop-this.UPLEVEL
          -document.body.scrollTop;
        //求步长
        this.step=
          this.DISTANCE/this.STEPS;
        //启动周期性定时
        this.timer=setInterval(
          this.scrollStep.bind(this),
          this.interval
        );
      }
    }
  },
  scrollStep:function(){//移动一步
    window.scrollBy(0,this.step);
    this.moved++;
    if(this.moved==this.STEPS){
      clearInterval(this.timer);
      this.timer=null;
      this.moved=0;
    }
  }
}