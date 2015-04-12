(function($, window) {
    window.MyBB = window.MyBB || {};
    
	window.MyBB.Modals = function Modals()
	{
		$("*[data-modal]").on("click", this.toggleModal).bind(this);
	};

	window.MyBB.Modals.prototype.toggleModal = function toggleModal(event) {
		event.preventDefault();

		// Check to make sure we're clicking the link and not a child of the link
		if(event.target.nodeName === "A")
		{
			// Woohoo, it's the link!
			var modalOpener = event.target,
				modalSelector = $(modalOpener).data("modal"),
				modalFind = $(modalOpener).data("modal-find"),
				modal = $('<div/>', {
	    			"class": "modal-dialog",
				}),
				modalContent = "";
		} else {
			// Nope, it's one of those darn children.
			var modalOpener = event.target,
				modalSelector = $(modalOpener).parent().data("modal"),
				modalFind = $(modalOpener).data("modal-find"),
				modal = $('<div/>', {
	    			"class": "modal-dialog",
				}),
				modalContent = "";
		}

		if (modalSelector.substring(0, 1) === "." || modalSelector.substring(0, 1) === "#") {
			// Assume using a local, existing HTML element.
			modalContent = $(modalSelector).html();
			modal.html(modalContent);
			modal.appendTo("body").modal({
				zIndex: 1000
			});
			$('.modalHide').hide();
			$("input[type=number]").stepper();
			$(".password-toggle").hideShowPassword(false, true);
		} else {
			// Assume modal content is coming from an AJAX request

			// data-modal-find is optional, default to "#content"
			if (modalFind === undefined) {
				modalFind = "#content";
			}

			$.get('/'+modalSelector, function(response) {
				var responseObject = $(response);

				modalContent = $(modalFind, responseObject).html();
				modal.html(modalContent);
				modal.appendTo("body").modal({
					zIndex: 1000
				});
				$('.modalHide').hide();
				$("input[type=number]").stepper();
				$(".password-toggle").hideShowPassword(false, true);
			});
		}
	};
    
    var modals = new window.MyBB.Modals(); // TODO: put this elsewhere :)
})(jQuery, window);
(function($, window) {
    window.MyBB = window.MyBB || {};

	window.MyBB.Posts = function Posts()
	{
		// Show and hide posts
		$(".postToggle").on("click", this.togglePost).bind(this);
	};

	// Show and hide posts
	window.MyBB.Posts.prototype.togglePost = function togglePost(event) {
		event.preventDefault();
		// Are we minimized or not?
		if($(event.target).hasClass("fa-minus"))
		{
			// Perhaps instead of hide, apply a CSS class?
			$(event.target).parent().parent().parent().addClass("post--hidden");
			// Make button a plus sign for expanding
			$(event.target).addClass("fa-plus");
			$(event.target).removeClass("fa-minus");

		} else {
			// We like this person again
			$(event.target).parent().parent().parent().removeClass("post--hidden");
			// Just in case we change our mind again, show the hide button
			$(event.target).addClass("fa-minus");
			$(event.target).removeClass("fa-show");
		}
	};


	var posts = new window.MyBB.Posts();

})(jQuery, window);
(function($, window) {
    window.MyBB = window.MyBB || {};
    
	window.MyBB.Polls = function Polls()
	{
		this.optionElement = $('#option-simple').clone().attr('id', '').removeClass('hidden').addClass('poll-option').hide();
		$('#option-simple').remove();

		this.removeOption($('#add-poll .poll-option'));

		$('#new-option').click($.proxy(this.addOption, this));

		$('#poll-maximum-options').hide();

		$('#poll-is-multiple').change($.proxy(this.toggleMaxOptionsInput, this)).change();

		var $addPollButton = $("#add-poll-button");
		$addPollButton.click($.proxy(this.toggleAddPoll, this));
		if($addPollButton.length) {
			if($('#add-poll-input').val() === '1') {
				$('#add-poll').slideDown();
			}
		}

		this.timePicker();
	};

	window.MyBB.Polls.prototype.timePicker = function timePicker() {
		$('#poll-end-at').datetimepicker({
			format: 'Y-m-d H:i:s',
			lang: $('html').attr('lang'),// TODO: use our i18n
			minDate: 0
		});
	};

	window.MyBB.Polls.prototype.toggleAddPoll = function toggleAddPoll() {
		if($('#add-poll-input').val() === '1') {
			$('#add-poll-input').val(0);
			$('#add-poll').slideUp();
		} else {
			$('#add-poll-input').val(1);
			$('#add-poll').slideDown();
		}
		return false;
	};

	window.MyBB.Polls.prototype.addOption = function addOption(event) {
		var num_options = $('#add-poll .poll-option').length;
		if(num_options >= 10) { // TODO: settings
			return false;
		}
		var $option = this.optionElement.clone();
		$option.find('input').attr('name', 'option['+(num_options+1)+']')
		$('#add-poll .poll-option').last().after($option);
		$option.slideDown();
		this.removeOption($option);
		return false;
	};

	window.MyBB.Polls.prototype.removeOption = function bindRemoveOption($parent) {
		$parent.find('.remove-option').click($.proxy(function(event) {
			var $me = $(event.target),
				$myParent = $me.parents('.poll-option');
			if($('.poll-option').length <= 2)
			{
				return false;
			}

			$myParent.slideUp(500);

			setTimeout($.proxy(function() {
				$myParent.remove();
				this.fixOptionsName();
			}, this), 500);
		}, this));
		if(!Modernizr.touch) {
			$parent.find('.remove-option').powerTip({ placement: 's', smartPlacement: true });
		}
	};

	window.MyBB.Polls.prototype.fixOptionsName = function() {
		var i = 0;
		$('#add-poll .poll-option').each(function() {
			i++;
			$(this).find('input').attr('name', 'option['+i+']');
		});
	};

	window.MyBB.Polls.prototype.toggleMaxOptionsInput = function toggleMaxOptionsInput(event) {
		me = event.target;
		if($(me).is(':checked')) {
			$('#poll-maximum-options').slideDown();
		}
		else {
			$('#poll-maximum-options').slideUp();
		}
	};

	var polls = new window.MyBB.Polls();

})(jQuery, window);
(function ($, window) {
    window.MyBB = window.MyBB || {};

    window.MyBB.Quotes = function Posts() {

        // MultiQuote
        $(".quoteButton").on("click", $.proxy(this.multiQuoteButton, this));

        this.showQuoteBar();

        $("#quoteBar__select").on("click", $.proxy(this.addQuotes, this));
        $("#quoteBar__deselect").on("click", $.proxy(this.removeQuotes, this));
    };

    window.MyBB.Quotes.prototype.getQuotes = function getQuotes() {
        var quotes = $.cookie('quotes');
        if (!quotes) {
            quotes = [];
        }
        else {
            quotes = quotes.split(',');
        }

        $.each(quotes, function (index, quote) {
            if (!quote) {
                delete quotes[index];
            }
        });

        return quotes;


    };

    // MultiQuote
    window.MyBB.Quotes.prototype.multiQuoteButton = function multiQuoteButton(event) {
        event.preventDefault();

        var $me = $(event.target),
            postId = $me.data('postid'),
            quotes = this.getQuotes();


        if (postId) {
            if (quotes.indexOf(postId) == -1) {
                quotes.push(postId);
            }
            else {
                delete quotes[quotes.indexOf(postId)];
            }

            $.cookie('quotes', quotes.join(','));

            this.showQuoteBar();
            return false;
        }

    };

    window.MyBB.Quotes.prototype.showQuoteBar = function showQuoteBar() {
        var quotes = this.getQuotes();

        if (quotes.length) {
            $("#quoteBar").show();
        }
        else {
            $("#quoteBar").hide();
        }
    };

    window.MyBB.Quotes.prototype.addQuotes = function addQuotes() {
        var quotes = this.getQuotes(),
            $quoteBar = $("#quoteBar"),
            $textarea = $($quoteBar.data('textarea'));

        // TODO: spinner

        $.ajax({
            url:'/post/quotes',
            data: {
                'posts': quotes,
                '_token': $quoteBar.parents('form').find('input[name=_token]').val()
            },
            method: 'POST'
        }).done(function(json) {
            if(json.error) {
                alert(json.error);// TODO: js error
            }
            else {
                $textarea.val($textarea.val() + json.message);
            }
        });

        $quoteBar.hide();
        $.cookie('quotes', '');
        return false;
    };

    window.MyBB.Quotes.prototype.removeQuotes = function removeQuotes() {
        $quoteBar = $("#quoteBar");
        $quoteBar.hide();
        $.cookie('quotes', '');
        return false;
    };

    var quotes = new window.MyBB.Quotes();

})
(jQuery, window);
$('html').addClass('js');

$(function () {
	
	$('.nojs').hide();

	if(Modernizr.touch)
	{
		$('.radio-buttons .radio-button, .checkbox-buttons .checkbox-button').click(function() {

		});
	}

	else
	{
		$('span.icons i, a, .caption, time').powerTip({ placement: 's', smartPlacement: true });
	}

	$('.user-navigation__links, #main-menu').dropit({ submenuEl: 'div.dropdown' });
	$('.dropdown-menu').dropit({ submenuEl: 'ul.dropdown', triggerEl: 'span.dropdown-button' });
	$("input[type=number]").stepper();
	$(".password-toggle").hideShowPassword(false, true);

	$('.clear-selection-posts a').click(function(event) {
		event.preventDefault();
		$('.thread').find('input[type=checkbox]:checked').removeAttr('checked').closest(".post").removeClass("highlight");
		$('.inline-moderation').removeClass('floating');
	});

	$('.clear-selection-threads a').click(function(event) {
		event.preventDefault();
		$('.thread-list').find('input[type=checkbox]:checked').removeAttr('checked').closest(".thread").removeClass("highlight");
		$('.checkbox-select.check-all').find('input[type=checkbox]:checked').removeAttr('checked');
		$('.inline-moderation').removeClass('floating');
	});

	$('.clear-selection-forums a').click(function(event) {
		event.preventDefault();
		$('.forum-list').find('input[type=checkbox]:checked').removeAttr('checked').closest(".forum").removeClass("highlight");
		$('.checkbox-select.check-all').find('input[type=checkbox]:checked').removeAttr('checked');
		$('.inline-moderation').removeClass('floating');
	});

	$("#search .search-button").click(function(event) {
		event.preventDefault();
		$("#search .search-container").slideDown();
	});

	$(".post :checkbox").change(function() {
		$(this).closest(".post").toggleClass("highlight", this.checked);

		var checked_boxes = $('.highlight').length;

		if(checked_boxes == 1)
		{
			$('.inline-moderation').addClass('floating');
		}

		if(checked_boxes == 0)
		{
			$('.inline-moderation').removeClass('floating');
		}

		$('.inline-moderation .selection-count').text(' ('+checked_boxes+')')
	});

	$(".thread .checkbox-select :checkbox").change(function() {
		$(this).closest(".thread").toggleClass("highlight", this.checked);

		var checked_boxes = $('.highlight').length;

		if(checked_boxes == 1)
		{
			$('.inline-moderation').addClass('floating');
		}

		if(checked_boxes == 0)
		{
			$('.inline-moderation').removeClass('floating');
		}

		$('.inline-moderation .selection-count').text(' ('+checked_boxes+')')
	});

	$(".forum .checkbox-select :checkbox").change(function() {
		$(this).closest(".forum").toggleClass("highlight", this.checked);

		var checked_boxes = $('.highlight').length;

		if(checked_boxes == 1)
		{
			$('.inline-moderation').addClass('floating');
		}

		if(checked_boxes == 0)
		{
			$('.inline-moderation').removeClass('floating');
		}

		$('.inline-moderation .selection-count').text(' ('+checked_boxes+')');
	});

	$(".checkbox-select.check-all :checkbox").click(function() {
		$(this).closest('section').find('input[type=checkbox]').prop('checked', this.checked);
		$(this).closest('section').find('.checkbox-select').closest('.thread').toggleClass("highlight", this.checked);
		$(this).closest('section').find('.checkbox-select').closest('.forum').toggleClass("highlight", this.checked);

		var checked_boxes = $('.highlight').length;

		if(checked_boxes >= 1)
		{
			$('.inline-moderation').addClass('floating');
		}

		if(checked_boxes == 0)
		{
			$('.inline-moderation').removeClass('floating');
		}

		$('.inline-moderation .selection-count').text(' ('+checked_boxes+')');
	});

/*	$('.post.reply textarea.editor, .form textarea.editor').sceditor({
		plugins: 'bbcode',
		style: 'js/vendor/sceditor/jquery.sceditor.default.min.css',
		emoticonsRoot: 'assets/images/',
		toolbar: 'bold,italic,underline|font,size,color,removeformat|left,center,right|image,link,unlink|emoticon,youtube|bulletlist,orderedlist|quote,code|source',
		resizeWidth: false,
		autofocus: false,
		autofocusEnd: false
	});*/
});