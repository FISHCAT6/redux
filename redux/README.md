# 手写redux库
项目描述：依托react框架，根据个人理解实现redux库功能以及示例展示。
运行方式：`npm start`
## 1.手写reducer
reducer初衷：解决state更改时对原state状态的破坏。reducer函数中形参state为需要更改的初始state值，type为需要更改的类型，payload为更改的值。
reducer内部通过对原state和更改值进行展开运算，进而合并需要更改的数据；最终返回一个新的对象，避免的了对组件初始state值的更改。

## 2.手写dispatch
reducer初衷：解决频繁修改state时，多次调用重复调用reducer及其他函数的问题。通过dispatch函数封装setXXX函数以及reducer函数。单独定义dispatch无法读取useState定义的状态值和更改函数（hooks只能在组件中读取使用），因此将dispatch封装在一个新的组件中，该组件包括hooks对应的值以及函数（通过上下文获得）、dispatch函数以及需要状态管理的组件。

## 3.手写connect
connect初衷：在没有创建connect函数之前，因为单独使用dispatch需要在外层包裹组件，不同组件多次使用dispatch就需要多次创建新的组件。
connect函数的作用是定义一个函数对需要管理的组件进行包裹，返回一个新的组件，该组件包含dispatch函数以及需要管理的组件。connect函数的参数为需要管理的组件，返回值为传入的组件、dispatch函数以及传入组件附带的props。

## 4.实现