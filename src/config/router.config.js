// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/components/layouts'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页' },
    redirect: '/base',
    children: [
      // 基础管理
      {
        path: '/base',
        name: 'base',
        redirect: '/base/welcome',
        component: PageView,
        meta: { title: '基础管理', icon: 'dashboard', permission: [ 'base' ] },
        children: [
          {
            path: '/base/welcome',
            name: 'welcome',
            component: () => import('@/views/base/welcome'),
            meta: { title: '欢迎语管理', permission: [ 'base' ] }
          },
          {
            path: '/base/noAnswerApply',
            name: 'noAnswerApply',
            component: () => import('@/views/base/noAnswerApply'),
            meta: { title: '无答案回复管理', permission: [ 'base' ] }
          }
        ]
      },

      // 问答管理
      {
        path: '/question',
        name: 'question',
        redirect: '/question/index',
        component: PageView,
        meta: { title: '问答管理', icon: 'question-circle', permission: [ 'question' ] },
        children: [
          {
            path: '/question/keyword',
            name: 'keyword',
            component: () => import('@/views/question/keyword'),
            meta: { title: '关键字管理', permission: [ 'question' ] }
          },
          {
            path: '/question/index',
            name: 'index',
            component: () => import('@/views/question/index'),
            meta: { title: '问题管理', permission: [ 'question' ] }
          },
          {
            path: '/question/add',
            name: 'questionAdd',
            component: () => import('@/views/question/question_add'),
            hidden: true,
            meta: { title: '问题新增/编辑', permission: [ 'question' ] }
          },
          {
            path: '/question/answer',
            name: 'answer',
            component: () => import('@/views/question/answer'),
            meta: { title: '答案管理', permission: [ 'question' ] }
          },
          {
            path: '/question/answerAdd',
            name: 'answerAdd',
            component: () => import('@/views/question/answer_add'),
            hidden: true,
            meta: { title: '答案新增/编辑', permission: [ 'question' ] }
          },
        ]
      },

      // 设备管理
      {
        path: '/equipment',
        name: 'equipment',
        redirect: '/equipment/index',
        component: PageView,
        meta: { title: '设备管理', icon: 'tool', permission: [ 'equipment' ] },
        children: [
          {
            path: '/equipment/index',
            name: 'equipment',
            component: () => import('@/views/equipment/index'),
            meta: { title: '设备管理', permission: [ 'equipment' ] }
          }
        ]
      },

      // 4s店管理
      {
        path: '/store',
        name: 'store',
        redirect: '/store/index',
        component: PageView,
        meta: { title: '4s店管理', icon: 'shop', permission: [ 'store' ] },
        children: [
          {
            path: '/store/index',
            name: 'store',
            component: () => import('@/views/store/index'),
            meta: { title: '4s店管理', permission: [ 'store' ] }
          }
        ]
      },

      // 轮播图管理
      {
        path: '/banner',
        name: 'banner',
        redirect: '/banner/index',
        component: PageView,
        meta: { title: '轮播图管理', icon: 'picture', permission: [ 'banner' ] },
        children: [
          {
            path: '/banner/index',
            name: 'banner',
            component: () => import('@/views/banner/index'),
            meta: { title: '轮播图管理', permission: [ 'banner' ] }
          }
        ]
      },

      // 统计分析
      {
        path: '/analysis',
        name: 'analysis',
        redirect: '/analysis/noRecognized',
        component: PageView,
        meta: { title: '统计分析', icon: 'pie-chart', permission: [ 'banner' ] },
        children: [
          {
            path: '/analysis/noRecognized',
            name: 'noRecognized',
            component: () => import('@/views/analysis/noRecognized'),
            meta: { title: '未识别问题统计', permission: [ 'analysis' ] }
          },
          {
            path: '/analysis/keyword',
            name: 'keywords',
            component: () => import('@/views/analysis/keyword'),
            meta: { title: '关键字匹配数量统计', permission: [ 'analysis' ] }
          },
          {
            path: '/analysis/firstKeyword',
            name: 'firstKeyword',
            component: () => import('@/views/analysis/firstKeyword'),
            meta: { title: '首次匹配到关键字统计', permission: [ 'analysis' ] }
          },
          {
            path: '/analysis/questionRoute',
            name: 'questionRoute',
            component: () => import('@/views/analysis/questionRoute'),
            meta: { title: '问题线路统计', permission: [ 'analysis' ] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      },
      {
        path: 'register',
        name: 'register',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Register')
      },
      {
        path: 'register-result',
        name: 'registerResult',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/RegisterResult')
      }
    ]
  },

  {
    path: '/test',
    component: BlankLayout,
    redirect: '/test/home',
    children: [
      {
        path: 'home',
        name: 'TestHome',
        component: () => import('@/views/Home')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  },

]
