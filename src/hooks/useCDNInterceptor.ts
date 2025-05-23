import { useEffect } from 'react';
const useCDNInterceptor = () => {
    useEffect(() => {
        // Service Worker 拦截逻辑
        const registerServiceWorker = () => {
            try {
                navigator.serviceWorker.register('sw.js'
                    // , { scope: '/' }
                )
                    .then(reg => console.log('CDN 拦截已启用 (Service Worker)'))
                    .catch((e) => {
                        console.error(e);
                    });
            } catch (e) {
                console.error(e);
            }
        };

        // 初始化逻辑
        if ('serviceWorker' in navigator) {
            registerServiceWorker();
        }

        // 清理函数
        return () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    registrations.forEach(reg => reg.unregister());
                });
            }
        };
    }, []);
};

export default useCDNInterceptor;