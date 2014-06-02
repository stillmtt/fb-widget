window.fbAsyncInit = function () {

    FB.init({
        appId: '662998693722951', // App ID es.129183060609606
        channelUrl: '//localhost/code/facebook/feeds.html', // Channel File
        status: true, // check login status
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: true // parse XFBML
    });



    FB.getFeeds = function(limit, aid){
        return{
            q: "SELECT post_id, actor_id, message, permalink, type, attachment, created_time FROM stream WHERE source_id = "+aid+" AND is_hidden = 0 AND type > 0 ORDER BY created_time DESC LIMIT "+limit,
            access_token: '662998693722951|2resa0G6oLua-yiA6mP7AbD41gI'
        };
    };



// Convert URLs @mentions, and #hashtags into anchor links
FB.fbLinks = function(text){

    text = text.replace(
        /(>|<a[^<>]+href=['"])?(https?:\/\/([-a-z0-9]+\.)+[a-z]{2,5}(\/[-a-z0-9!#()\/?&.,]*[^ !#?().,])?)/gi,
        function($0, $1, $2) {
            return ($1 ? $0 : '<a href="' + $2 + '" target="_blank">' + $2 + '</a>');
        });

    return text;
};
   
    var feeds = "<ul>";

    FB.api('/fql',FB.getFeeds(5, '119869244718850'), function(response){
        if(!response || response.error){
            console.log(response.error.message);
            return console.log("still there's an error: "+response.error.code);
        }

            $.each(response.data, function(idx, val){
                var attach = val.attachment,
                    date = new Date(val.created_time*1000),
                    time = moment(date).fromNow();


                if(attach.media){

                    var attachMedia = attach.media[0];

                    if(val.type === 247){
                        var photo_url = attachMedia.src,
                            photo_alt = attachMedia.alt,
                            photo_link = attachMedia.href;

                        if(val.message){

                            feeds += "<li><a href='"+photo_link+"' target='_blank' title='"+photo_alt+"'><div class='imgBg' style='background-image: url("+photo_url+")'></div></a><a href='"+val.permalink+"' target='_blank' title='"+val.message+"'>"+val.message+"</a><span>"+time+"</span></li>";
                        }else{

                            feeds += "<li><a class='imgOnly' href='"+photo_link+"' target='_blank' title='"+photo_alt+"'><div class='imgBg' style='background-image: url("+photo_url+")'></div></a><span>"+time+"</span></li>";
                        }

                    }

                }else{
                   feeds += "<li><a href='"+val.permalink+"' target='_blank' title='"+val.message+"'>"+FB.fbLinks(val.message)+"</a><span>"+time+"</span></li>";
                }



                
            });

            feeds +="</ul>";
            feeds +="<div class='fb_follow'>test</div>";
             
            $('.fb_feeds').html(feeds);
            $('.fb_follow').html($('.fb-follow'));

    });
};

// Load the SDK's source Asynchronously
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

