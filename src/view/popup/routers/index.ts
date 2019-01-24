import AsyncComponent from '../../components/asyncComponent';
// import redirectComponent from '@/components/redirectComponent';

export default [
    {
        component: AsyncComponent(() => import('../welcome/index')),
        path: '/welcome',
    },
    {
        component: AsyncComponent(()=>import('../test/index')),
        path:'/test'
    }
];