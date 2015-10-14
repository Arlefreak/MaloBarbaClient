var feed = new Instafeed({
    clientId: '29293f7575c2483cb47a61d6839adbf0',
    accessToken: '30631706.29293f7.f4b915e4a06c4f63840f6fe094c8ba2c',
    get: 'user',
    userId: 1917667751,
    resolution: 'standard_resolution',
    template: '<a href="{{link}}" target="_blank"><img src="{{image}}" /></div></a>',
    limit: 100
});
feed.run();
