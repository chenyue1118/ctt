# CTT

## 项目启动
  npm install
  nodemon app
  在public目录下 node-sass -w -r scss - o css

## 项目预览
` 
  |--首页      http://182.61.175.203:8801/
  |--订单搜索  http://182.61.175.203:8801/china-trains/train-search.html
  |--订单预定  http://182.61.175.203:8801/china-trains/train-booking.html
  |--订单支付  http://182.61.175.203:8801/china-trains/train-pay.html
  |--订单详情  http://182.61.175.203:8801/china-trains/train-details.html
  |--订单取消  http://182.61.175.203:8801/china-trains/train-cancel.html
  |--订单搜索  http://182.61.175.203:8801/china-trains/train-check.html
`

## 项目接口
  ### 首页
  热门城市
  热门城市路线

  ### 搜索页面
  车次查询  （传参：起点，终点，日期）

  ### 下订单页面
  下订单接口　　（传参：车次信息，选择的人数，人员信息，票送方式，高铁选择，联系信息）

  ### 支付页面
  请求支付  （需要集成那些集成方式）
  支付成功回调

  ### 订单详情页面
  查询订单详情  （传参：订单号，邮箱查询）

  ### 订单取消页面
  取消订单接口 （传参：订单号和取消理由）
