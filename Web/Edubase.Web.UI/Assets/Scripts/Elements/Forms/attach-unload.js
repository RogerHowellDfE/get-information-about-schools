﻿
/**
 *
 * @param String message - shown in the system unload dialog
 * @param Array permitedExits - array of selectors of elements which are `valid exits`
 * @returns {}
 */
DfE.Util.showUnload = function (message, permitedExits) {
    permitedExits = permitedExits || [];
    message = message || 'Are you sure you want to leave this page';
    permitedExits.push('input[type="submit"]', 'button[type="submit"]');

    var exitUrl = '';
    var exitElem;

    var $contentArea = $('#full-content'),
            youMayLeave = false,
            $permittedEscapes = $contentArea.find('input[type="submit"], button[type="submit"], .error-summary-list a').not('[value="cancel"]'),

            overlay = '<div id="modal-overlay" class="modal-overlay hidden"></div>' +
            	'<div id="modal-content" class="modal-content hidden" role="dialog"><a href="#" id="exit-overlay" class="modal-exit">Close</a><div id="modal-inner">' +
                '<h3 class="heading-large">Are you sure you want to leave this page?</h3><p>Any unsaved changes will be lost.</p></div> ' +
                '<div class="button-row"><a href="#" class="button mobile-full-width" id="button-ok">OK</a><a href="#" class="button button-secondary mobile-full-width" id="button-cancel">Cancel</a></div>' +
                '</div>';

    $('body').append(overlay);

    this.suppress = function () {
        youMayLeave = true;
    }

    function bindEscapeKey() {
        $(document).on('keyup', function (e) {
            e = e || window.event;
            if (e.keyCode === 27) {
                closeModal();
            }
        });
    }

    function unbindEscapeKey() {
        $(document).off('keyup');
    }

    function showModal() {
        bindEscapeKey();
        $('#modal-overlay, #modal-content').removeClass('hidden');

        var modalChildren = $('#modal-inner').children();
        var description = $('#modal-inner').find(':header').slice(0, 1);

        modalChildren.attr('tabindex', 0);

        if (description.length > 0) {
            var descId = 'modal-desc';
            var labelId = 'modal-label';
            if (!description[0].hasAttribute('id')) {
                description.attr('id', 'modal-label');
            } else {
                labelId = description.attr('id');
            }

            if (!description.next()[0].hasAttribute('id')) {
                description.next().attr('id', 'model-desc');
            } else {
                descId = description.next().attr('id');
            }

            $('#modal-content').attr({ 'aria-labelledby': labelId, 'aria-describedby': descId });
        }

        // Focus on main CTA
        $('#button-ok').focus();
    }

    function closeModal() {
        unbindEscapeKey();
        $('#modal-content , #modal-overlay').addClass('hidden');
    }


    $('#exit-overlay , #modal-overlay, #button-cancel')
        .on('click', function (e) {
            e.preventDefault();
            closeModal();
        });



    $permittedEscapes.addClass('js-allow-exit');

    $contentArea.on('click', '.js-allow-exit', function () {
        youMayLeave = true;
        window.setTimeout(function () {
            youMayLeave = false;
        }, 100);
    });



    $contentArea.on('click', 'a, button', function (e) {
        if (!youMayLeave) {
            e.preventDefault();
            exitUrl = $(this).attr('href');
            exitElem = $(this);
            showModal();
        }

    });

    $('body').on('click', '#button-ok', function () {
        youMayLeave = true;
        if (typeof exitUrl !== 'undefined') {
            window.location = exitUrl;
        } else {
            exitElem.click();
        }

    });

    $(window).on('beforeunload', function (e) {
        if (!youMayLeave) {
            return message;
        }
    });

    return this;
};

