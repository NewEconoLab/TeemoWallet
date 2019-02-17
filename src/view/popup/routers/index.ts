import AsyncComponent from '../../components/asyncComponent';
// import redirectComponent from '@/components/redirectComponent';

export default [
    {
        component: AsyncComponent(() => import('../containers/welcome')),
        path: '/welcome',
    },
    {
        component: AsyncComponent(()=>import('../containers/login')),
        path:'/login'
    },
    {
        component: AsyncComponent(()=>import('../containers/walletnew')),
        path:'/walletnew'
    },
    {
        component:AsyncComponent(()=>import('../containers/mywallet')),
        path:'/mywallet'
    },
    {
        component: AsyncComponent(()=>import('../containers/test')),
        path:'/test'
    },
    {
      component: AsyncComponent(() => import('../containers/login')),
      exact: true,
      path: '/',
    },
    {
        path: '*',
        component: AsyncComponent(() => import('../containers/welcome')),
        requiresAuth: false,
    }
];