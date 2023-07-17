(function($) {
    $(document).ready(function() {
        /**
         * Пауза, выключение звука и сдвиг ползунка timeline
         */
        $('.js--audio-play, .js--audio-mute').on('click', function () {
            // Меняем иконку
            glyphicon = $(this).find('.glyphicon');
            toggleClass = glyphicon.data('toggle-class');
            glyphicon.data('toggle-class', glyphicon.attr('class')).removeClass().addClass(toggleClass);

            audio = $(this).closest('.js--audio-wrap').find('.js--audio-cont');
            timeline = audio.closest('.js--audio-wrap').find('.js--timeline');
            duration = audio.prop('duration');
            width = timeline.width();
            if ($(this).hasClass('js--audio-play')) {
                // Старт/пауза и двигаем ползунок
                if(audio.prop('paused')) {
                    audio.trigger('play');
                    idInterval = setInterval(function () {
                        currentTime = audio.prop('currentTime');
                        left = width*currentTime/duration;
                        timeline.find('.js--timeline-control').css('left', left+'px');
                        if (currentTime == duration) {
                            clearInterval(idInterval);
                        }
                    }, 1000);
                } else {
                    audio.trigger('pause');
                    clearInterval(idInterval);
                }
            } else {
                // Переключаем звук
                audio.prop("muted",!audio.prop("muted"));
            }
            return false;
        });

        /**
         * Перемотка трека по клику на timeline
         */
        $('.js--timeline').on('click', function (e) {
            audioTime = $(this).closest('.js--audio-wrap').find('.js--audio-cont');
            duration = audioTime.prop('duration');
            if (duration > 0) {
                offset = $(this).offset();
                left = e.clientX-offset.left;
                width = $(this).width();
                $(this).find('.js--timeline-control').css('left', left+'px');
                audioTime.prop('currentTime', duration*left/width);
            }
            return false;
        });
    });
})(jQuery);
