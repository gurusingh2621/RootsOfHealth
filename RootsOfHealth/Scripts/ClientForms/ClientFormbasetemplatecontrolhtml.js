var new_id = 0;
var newid = "";
$(function () {
   
    HtmlControlDragnDrop();
    if (sessionStorage.getItem("Id") === null) {
        GetFormHtmlById(templateId);
    } else {
        GetFormHtmlById(sessionStorage.getItem("Id"));
        $("#hdnTemplateId").val(sessionStorage.getItem("Id"));
    }
});
function CheckSortableHtml() {
    $("#ddlform").val("0");
    HtmlControlDragnDrop();
}
//HtmlControlDragnDrop=>use for drag html control from left list and drop on right dropable area
function HtmlControlDragnDrop() {

    $('#control-box li').draggable({
        connectToSortable: '.baseheader,.basefooter',
        helper: function () {
            var cloned = $(this).clone();
            cloned.attr('id', (++new_id).toString());
            return cloned;
        },
        revert: "invalid"
    });
    $(".baseheader,.basefooter").sortable({
        connectWith: "#control-box",
        containment: "#droppable",
        placeholder: "highlight",
        start: function (e, ui) {
            placeholderHeight = ui.item.outerHeight();
            placeholderWidth = ui.item.outerWidth();
            if (placeholderWidth > 100) {
                ui.placeholder.height(placeholderHeight - 2);
                ui.placeholder.width(placeholderWidth - 2);
            } else {
                $(ui.placeholder).css('display', 'none');
            }

        },
        receive: function (event, ui) {
            var draggableId = ui.item.attr("data-type");
            var currentid = $(ui.helper).clone().attr('id')
            newid = draggableId + currentid;
            while (true) {
                if ($(document.getElementById(newid)).length) {
                    currentid = parseInt(currentid) + 1;
                    newid = draggableId + currentid;
                } else {
                    break;
                }
            }
            switch (draggableId) {
                case "label":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group"><label id="' + newid + '" class="editable">Html</label><div class="html-content"></div></div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='label']").replaceWith(str);
                    break;
                case "checkbox-group":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group base-control" id="' + newid + '">' +
                        '<label class="checkbox-group "><span class="title">Check Box (Multiple)</span><span class="desc"></span></label>' +
                        '<div class="custom-control custom-checkbox  d-inline-block mr-2">' +
                        '<input  type="checkbox" class="custom-control-input" name="checkbox" value="1" id="checkbox1">' +
                        '<label class="custom-control-label" for="checkbox1">option 1</label></div>' +
                        '<div class="custom-control custom-checkbox  d-inline-block mr-2">' +
                        '<input type="checkbox" class="custom-control-input"  name="checkbox" value="2" id="checkbox2">' +
                        '<label class="custom-control-label" for="checkbox2">option 2</label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='checkbox-group']").replaceWith(str);
                    break;
                case "date":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Label</span><span class="desc"></span></label>' +
                        '<div class="inputContent"><input id="' + newid + '"  type="date" class="form-control base-control" id=""/><label class="label-base"></label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div> ';
                    $(this).find("li[data-type='date']").replaceWith(str);
                    break;
                case "file":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Label</span><span class="desc"></span></label >' +
                        '<div class="inputContent"><input id="' + newid + '" onchange="previewOnfileChange(this)"  type="file" class="form-control base-control" id=""/><label class="label-base"></label>' +
                        '<div class="' + newid + '_files uploaded_filewrap"></div>' +
                        '</div></div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';

                    $(this).find("li[data-type='file']").replaceWith(str);
                    break;
                case "number":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Label</span><span class="desc"></span></label>' +
                        '<div class="inputContent"><input id="' + newid + '"  type="number" class="form-control base-control" id=""/><label class="label-base"></label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='number']").replaceWith(str);
                    break;
                case "radio-group":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group base-control"  id="' + newid + '">' +
                        '<label class="radiobox-group "><span class="title">Radio</span><span class="desc"></span></label>' +
                        '<div class="custom-control custom-radio d-inline-block mr-2">' +
                        '<input  type="radio" class="custom-control-input" name="radio" value="1" id="radio1">' +
                        '<label class="custom-control-label" for="radio1">option 1</label></div>' +
                        '<div class="custom-control custom-radio d-inline-block mr-2">' +
                        '<input type="radio" class="custom-control-input"  name="radio" value="2" id="radio2">' +
                        '<label class="custom-control-label" for="radio2">option 2</label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='radio-group']").replaceWith(str);
                    break;
                case "select":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Select</span><span class="desc"></span></label>' +
                        '<div class="inputContent"><select id="' + newid + '" class="form-control base-control"></div>' +
                        '<option  value="0">option 1</option>' +
                        '<option  value="1">option 2</option>' +
                        '<option  value="2">option 3</option>' +
                        ' </select>' +
                        '<label class="label-base"></label>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='select']").replaceWith(str);
                    break;
                case "text":
                    var str = '<div class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Label</span><span class="desc"></span ></label>' +

                        '<div class="inputContent"><input id="' + newid + '"  type="text" class="form-control base-control" id=""/><label class="label-base"></label></div>' +
                        '</div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='text']").replaceWith(str);
                    break;
                case "textarea":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Textarea</span><span class="desc"></span ></label>' +
                        '<div class="inputContent"><div class="ck-editor">' +
                        '<div class="ck-editor-header"><ul><li><i class="fa fa-list-ul" aria-hidden="true"></i></li><li><i class="fa fa-list-ol" aria-hidden="true"></i></li><li><i class="fa fa-align-left" aria-hidden="true"></i></li><li><i class="fa fa-bold" aria-hidden="true"></i></li><li><i class="fa fa-italic" aria-hidden="true"></i></li><li><i class="fa fa-underline" aria-hidden="true"></i></li><li><i class="fa fa-eraser" aria-hidden="true"></i></li></ul></div>' +
                        '<textarea id="' + newid + '"  class="form-control base-control" name="my-textarea"></textarea>' +
                        '<label class="label-base"></label>' +
                        '</div></div></div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='textarea']").replaceWith(str);

                    break;
                case "priority":
                    var str = '<div  class="dragresize col-md-12"><div class="frmbtn"><div class="form-group">' +
                        '<label class=""><span class="title">Priority</span><span class="desc"></span></label>' +
                        '<div class="inputContent"> <ul id="' + newid + '" class="form-control  priority base-control" style="border:none;">' +
                        '<li style="margin-bottom: 5px" value="1">option 1</li>' +
                        '<li style="margin-bottom: 5px" value="2">option 2</li>' +
                        ' </ul>' +
                        '<label class="label-program"></label>' +
                        '</div></div>' +
                        '<div class="event-btn-right"><button class="event-btn file-edit" onclick="EditHtml(\'' + draggableId + '\',\'' + newid + '\')"><i class="fas fa-edit"></i></button>' +
                        '<button class="event-btn file-remove" onclick="RemoveControl(this)"><i class="fa fa-minus-circle" aria-hidden="true"></i></button></div></div>' +
                        '</div>';
                    $(this).find("li[data-type='priority']").replaceWith(str);
                    initiatePriorityList()
                    break;

            }
        },
        stop: function (event, ui) {
            $('#droppable').find("input.form-control,textarea.form-control").on('input', function (e) {
                $(this).val('');
            });
            $('input[type="checkbox"],input[type="radio"]').click(function (event) {
                var $checkbox = $(this);
                setTimeout(function () {
                    $checkbox.removeAttr('checked');
                }, 0);

                event.preventDefault();
                event.stopPropagation();
            });
            if ($(".baseheader").find(".dragresize").length == 0) {
                $(".baseheader").next("span.basecontentspan").show();
            } else {
                $(".baseheader").next("span.basecontentspan").hide();
            }

            if ($(".basefooter").find(".dragresize").length == 0) {
                $(".basefooter").next("span.basecontentspan").show();
            } else {
                $(".basefooter").next("span.basecontentspan").hide();
            }
            if (ui.item.hasClass("ui-draggable") && ui.item.attr("data-index") === undefined) {
                EditHtml(ui.item.attr("data-type"), newid);
            }
        }
    });
}
function initiatePriorityList(){
    $(".priority").sortable();
}
//EditHtml=>use to open poup with current property of control
function EditHtml(type, ID) {
    var controlId = "#" + ID;
    $('.tooltipicon').tooltip('hide');
    var popupString = '';
    $(".edithtml-body").html("");
    switch (type) {
        case "label":
            popupString = '<div class="modal-row">' +
                '<label></label>' +
                '<textarea    class="form-control lbltext"  value="">' + $(controlId).next().html() + '</textarea>' +
                '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($('.lbltext').summernote('isEmpty')) {
                    toastr.error("", "Editor content is empty", { progressBar: true });
                    return;
                }
                var markupStr = $('.lbltext').summernote('code');
                $(controlId).next(".html-content").html("");
                $(controlId).next(".html-content").html(markupStr);
                $('.lbltext').summernote('destroy');
                $("#exampleModalCenter").modal("hide");
            });
            break;
        case "checkbox-group":
            var isrequired = $(controlId).find(".required-asterisk");
            var tooltiptext = $(controlId).find("label").first().find("span.tooltipicon").attr("title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext == '' ? $(controlId).find("label").first().find("span.tooltipicon").attr("data-original-title") : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).find(".checkbox-group").find("span.title").text();
            if (labelText == "Check Box (Multiple)") {
                labelText = "";
            }
            var columnName = $(controlId).find("input.custom-control-input").first().attr("data-column");
            var lbldescriptionText = $(controlId).find(".checkbox-group").find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired.length) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';


            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += `<div class="modal-row"><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input checkhorizontal" id="radio-horizontal" name="radio" value="horizontal" ${ $(controlId).hasClass("vertical") ? "" : "checked"}>
    <label class="custom-control-label" for="radio-horizontal">Horizontal</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input checkvertical" id="radio-vertical" name="radio" value="vertical"  ${ $(controlId).hasClass("vertical") ? "checked" : ""}>
    <label class="custom-control-label" for="radio-vertical">Vertical</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Options<span class="addoptions" onclick="addoption(this)"><i class="fas fa-plus"></i></span></label>';
            popupString += '<div class="optionHeading"><label>Text</label><label>Value</label></div>';
            $(controlId).find("input[type='checkbox']").each(function (index, item) {
                popupString += '<div class="option-block">' +
                    '<div class="option-fields">' +
                    `<input type="text" placeholder="Option Text" class="form-control option-text"  value="${($(item).next().text() == "option 1" || $(item).next().text() == "option 2") && $(controlId).find("input.custom-control-input").first().attr("data-column") === undefined ? "" : $(item).next().text()}"/>` +
                    ' <input type="text" placeholder="Value" class="form-control option-value" disabled value="' + $(item).attr("value") + '"/>' +
                    '</div>' +
                    '<div class="popup-event-btn">' +
                    `<button class="event-btn file-remove" onclick="RemoveOption(this)" ${index == 0 ? "disabled" : ""}><i class="fa fa-minus-circle" aria-hidden="true"></i></button >` +
                    '</div></div>'
            });
            popupString += '</div></div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), $(controlId).find("input").first().attr("id"))) {
                    return;
                }
                var breakout = false;
                $('.option-block').each(function () {
                    if ($(this).find("input.option-text").val().trim() == '' || $(this).find("input.option-value").val().trim() == '') {
                        breakout = true;
                        return false;
                    }
                });
                if (breakout) {
                    breakout = false;
                    toastr.error("", "Options can not be empty", { progressBar: true });
                    return false;
                }

                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).find("input.custom-control-input").first().attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }

                }

                var allTextArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-text").val().trim() != '')

                        return $(this).find("input.option-text").val().trim()
                }).get();
                var duplicateTextArray = allTextArray.filter(function (element, pos) {
                    if (allTextArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                var allValueArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-value").val().trim() != '')

                        return $(this).find("input.option-value").val().trim()
                }).get();
                var duplicateValueArray = allValueArray.filter(function (element, pos) {
                    if (allValueArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                if (duplicateValueArray.length != 0) {
                    toastr.error("", "Option value can not be duplicate", { progressBar: true });
                    return;
                }
                if (duplicateTextArray.length != 0) {
                    toastr.error("", "Option text can not be duplicate", { progressBar: true });
                    return;
                }
                $(controlId).html("");
                $(controlId).html("<label class='checkbox-group'><span class='title'>Check Box (Multiple)</span><span class='desc'></span></label>");
                var option_data = "<div class='inputContent'><div class='checkbox-html'>";
                
                $(".option-block").each(function (index) {
                    option_data += `<div class="custom-control custom-checkbox  d-inline-block mr-2">
                     <input  type="checkbox" class="custom-control-input" id="${ID + index}"  name="${ID}"value="${$(this).find("input.option-text").val().trim()}">
                     <label class="custom-control-label" for="${ID + index}">${$(this).find("input.option-text").val().trim()}</label></div>
                     `;
                });
                option_data += "</div><label class='label-base'></label></div>";
                $(controlId).find("div").html("");
                $(controlId).append(option_data);
                $(controlId).find(".checkbox-group").find("span.title").html("").append($(".lbltext").val().trim());
                if (columnName != undefined) {

                    $(controlId).find("input.custom-control-input").first().attr("data-column", columnName);
                } else {
                    $(controlId).find("input.custom-control-input").first().attr("data-column", colname);
                }
                if ($("#required-input").prop("checked")) {
                    $(controlId).find('label:first-child').addClass("required-asterisk");
                } else {
                    $(controlId).find('label:first-child').removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).find(".checkbox-group").find("span.title").append('<span data-toggle="tooltip"  data-placement="top"  title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).find("label").first().find("span.tooltipicon").remove();
                }

                $(controlId).find(".checkbox-group").find("span.desc").html("").append($(".lbldescription").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($(".checkhorizontal").prop("checked")) {
                    $(controlId).removeClass("vertical");
                } else if ($(".checkvertical").prop("checked")) {
                    $(controlId).addClass("vertical");
                }
                if ($(".labeltop").prop("checked")) {
                    $(controlId).removeClass("f-g-left");
                    $(controlId).find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).addClass("f-g-left");
                    $(controlId).find('label:first-child').addClass("label-left");
                }
                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "date":
            var isrequired = $(controlId).parent().prev().hasClass("required-asterisk");
            var tooltiptext = $(controlId).parent().prev().find("span.tooltipicon").attr("title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext == '' ? $(controlId).parent().prev().find("span.tooltipicon").attr("data-original-title") : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).parent().prev().find("span.title").text();
            if (labelText == "Label") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().prev().find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
            <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
            <label class="custom-control-label" for="label-top">top</label></div>
            <div class="custom-control custom-radio d-inline-block mr-2">
            <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
            <label class="custom-control-label" for="label-left">left</label></div>
            </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';

            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var isfieldmd4 = $(controlId).hasClass("col-md-4") ? "selected" : "";
            var isfieldmd6 = $(controlId).hasClass("col-md-6") ? "selected" : "";
            var isfieldmd12 = $(controlId).hasClass("col-md-12") ? "selected" : "";
            if (isfieldmd4 == "" && isfieldmd6 == "" && isfieldmd12 == "") isfieldmd12 = "selected";


            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + isfieldmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isfieldmd6 + '>Medium</option>' +
                '<option value="" ' + isfieldmd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }
                $(controlId).parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);


                if ($("#required-input").prop("checked")) {
                    $(controlId).parent().prev().addClass("required-asterisk");
                } else {
                    $(controlId).parent().prev().removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($("#fieldsize").val() == "col-md-12") {
                    $(controlId).removeClass("col-md-12");
                }
                $("#exampleModalCenter").modal("hide");
            });
            break;
        case "file":
            var isrequired = $(controlId).parent().prev().hasClass("required-asterisk");
            var tooltiptext = $(controlId).parent().prev().find("span.tooltipicon").attr("data-original-title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var allowMultiple = $(controlId).attr("multiple");
            var fileSize = $(controlId).attr("data-filesize");
            if (fileSize === undefined) {
                fileSize = '';
            }
            var labelText = $(controlId).parent().prev().find("span.title").text();
            if (labelText == "Label") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().prev().find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
                             <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
                             <label class="custom-control-label" for="label-top">top</label></div>
                             <div class="custom-control custom-radio d-inline-block mr-2">
                             <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
                             <label class="custom-control-label" for="label-left">left</label></div>
                             </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';
            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";

            popupString += `<div class="modal-row divFiletype"><label class="control-label required-asterisk"> Available file format</label>
             <div class="form-group">
             <select class="form-control" id="filetype" multiple>
             <option value=".png">png</option>
             <option value=".jpg">jpg</option>
             <option value=".jpeg">jpeg</option>
             <option value=".doc">doc</option>
             <option value=".docx">docx</option>
             <option value=".pdf">pdf</option>           
              <option value=".xls">xls</option>
              <option value=".xlsx">xlsx</option>
              <option value=".rtf">rtf</option>
              <option value=".txt">txt</option>
             </select>
             </div></div>`;
            popupString += `<div class="modal-row"><label>Allow multiple files:  </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input" id="label-multiple-yes" name="radio-multiple" value="yes"  ${allowMultiple != undefined ? "checked" : ""}>
    <label class="custom-control-label" for="label-multiple-yes">Yes</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input" id="label-multiple-no" name="radio-multiple" value="no" ${allowMultiple === undefined ? "checked" : ""}>
    <label class="custom-control-label" for="label-multiple-no">No</label></div>
    </div>`;
            popupString += `<div class="modal-row"><label class="required-asterisk">Individual file size(in kb)</label><input type="text" onkeyup="validateFileSize(this)" class="form-control lblfilesize" value="${fileSize}"></div>`;

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12"' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                var filetypes = $("#filetype").val();
                if (filetypes.length == 0) {
                    toastr.error("", "Please select file format", { progressBar: true });
                    return;
                }
                if ($(".lblfilesize").val().trim() == '') {
                    toastr.error("", "File size is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }
                $(controlId).parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);

                $(controlId).attr("data-accept", $("#filetype").val());
                $(controlId).attr("data-filesize", $(".lblfilesize").val());
                if ($("#required-input").prop("checked")) {
                    $(controlId).parent().prev().addClass("required-asterisk");
                } else {
                    $(controlId).parent().prev().removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();
                } else {
                    $(controlId).parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($("#label-multiple-yes").prop("checked")) {
                    $(controlId).attr("multiple", '');
                } else {
                    $(controlId).removeAttr("multiple");
                }
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "number":
            var isrequired = $(controlId).parent().prev().hasClass("required-asterisk");
            var tooltiptext = $(controlId).parent().prev().find("span.tooltipicon").attr("data-original-title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).parent().prev().find("span.title").text();
            if (labelText == "Label") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().prev().find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';

            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var isfieldmd4 = $(controlId).hasClass("col-md-4") ? "selected" : "";
            var isfieldmd6 = $(controlId).hasClass("col-md-6") ? "selected" : "";
            var isfieldmd12 = $(controlId).hasClass("col-md-12") ? "selected" : "";

            if (isfieldmd4 == "" && isfieldmd6 == "" && isfieldmd12 == "") isfieldmd12 = "selected";


            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + isfieldmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isfieldmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isfieldmd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }
                $(controlId).parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);
                if ($("#required-input").prop("checked")) {
                    $(controlId).parent().prev().addClass("required-asterisk");
                } else {
                    $(controlId).parent().prev().removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($("#fieldsize").val() == "col-md-12") {
                    $(controlId).removeClass("col-md-12");
                }
                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "radio-group":
            var isrequired = $(controlId).find(".required-asterisk");
            var tooltiptext = $(controlId).find("label").first().find("span.tooltipicon").attr("title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext == '' ? $(controlId).find("label").first().find("span.tooltipicon").attr("data-original-title") : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).find(".radiobox-group").find("span.title").text();
            if (labelText == "Radio") {
                labelText = "";
            }
            var columnName = $(controlId).find("input.custom-control-input").first().attr("data-column");
            var lbldescriptionText = $(controlId).find(".radiobox-group").find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired.length) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
                           <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).hasClass("f-g-left") ? "" : "checked"}>
                           <label class="custom-control-label" for="label-top">top</label></div>
                           <div class="custom-control custom-radio d-inline-block mr-2">
                           <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).hasClass("f-g-left") ? "checked" : ""}>
                           <label class="custom-control-label" for="label-left">left</label></div>
                           </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';
            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += `<div class="modal-row"><div class="custom-control custom-radio d-inline-block mr-2">
                            <input type="radio" class="custom-control-input radiohorizontal" id="radio-horizontal" name="radio" value="horizontal" ${ $(controlId).hasClass("vertical") ? "" : "checked"}>
                            <label class="custom-control-label" for="radio-horizontal">Horizontal</label></div>
                            <div class="custom-control custom-radio d-inline-block mr-2">
                            <input type="radio" class="custom-control-input radiovertical" id="radio-vertical" name="radio" value="vertical"  ${ $(controlId).hasClass("vertical") ? "checked" : ""}>
                            <label class="custom-control-label" for="radio-vertical">Vertical</label></div>
                            </div>`;
            popupString += '<div class="modal-row">' +
                '<label>Options<span class="addoptions" onclick="addoption(this)"><i class="fas fa-plus"></i></span></label>';
            popupString += '<div class="optionHeading"><label>Text</label><label>Value</label></div>';
            $(controlId).find("input[type=radio]").each(function (index, item) {
                popupString += '<div class="option-block">' +
                    '<div class="option-fields">' +
                    `<input type="text" placeholder="Option Text" class="form-control option-text"  value="${($(item).next().text() == "option 1" || $(item).next().text() == "option 2") && $(controlId).find("input.custom-control-input").first().attr("data-column") === undefined ? "" : $(item).next().text()}"/>` +
                    ' <input type="text" placeholder="Value" class="form-control option-value" disabled value="' + $(item).attr("value") + '"/>' +
                    '</div>' +
                    '<div class="popup-event-btn">' +
                    `<button class="event-btn file-remove" onclick="RemoveOption(this)" ${index == 0 ? "disabled" : ""}> <i class="fa fa-minus-circle" aria-hidden="true"></i></button >` +
                    '</div></div>'
            });
            popupString += '</div></div> ';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), $(controlId).find("[type=radio]").attr("id"))) {
                    return;
                }
                var breakout = false;
                $('.option-block').each(function () {
                    if ($(this).find("input.option-text").val().trim() == '' || $(this).find("input.option-value").val().trim() == '') {
                        breakout = true;
                        return false;
                    }
                });
                if (breakout) {
                    breakout = false;
                    toastr.error("", "Options can not be empty", { progressBar: true });
                    return false;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).find("input.custom-control-input").first().attr("data-column") == undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                }


                var allTextArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-text").val() != '')

                        return $(this).find("input.option-text").val()
                }).get();
                var duplicateTextArray = allTextArray.filter(function (element, pos) {
                    if (allTextArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                var allValueArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-value").val() != '')

                        return $(this).find("input.option-value").val()
                }).get();
                var duplicateValueArray = allValueArray.filter(function (element, pos) {
                    if (allValueArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                if (duplicateValueArray.length != 0) {
                    toastr.error("", "Option value can not be duplicate", { progressBar: true });
                    return;
                }
                if (duplicateTextArray.length != 0) {
                    toastr.error("", "Option text can not be duplicate", { progressBar: true });
                    return;
                }
                $(controlId).html("");
                $(controlId).html("<label class='radiobox-group'><span class='title'>Radio</span><span class='desc'></span></label>");
                var option_data = "<div class='inputContent'><div class='radio-html'>";
                $(".option-block").each(function (index) {
                    option_data += `<div class="custom-control custom-radio d-inline-block mr-2">
    <input  type="radio" class="custom-control-input" id="${ID + index}"  name="${ID}"  value="${$(this).find("input.option-text").val()}">
    <label class="custom-control-label" for="${ID + index}">${$(this).find("input.option-text").val()}</label></div>
    `;
                });
                option_data += "</div><label class='label-base'></label></div>";
                $(controlId).find("div").html("");
                $(controlId).append(option_data);
                if (columnName != undefined) {

                    $(controlId).find("input.custom-control-input").first().attr("data-column", columnName);
                } else {
                    $(controlId).find("input.custom-control-input").first().attr("data-column", colname);
                }

                $(controlId).find(".radiobox-group").find("span.title").html("").append($(".lbltext").val().trim());
                $(controlId).find(".radiobox-group").find("span.desc").html("").append($(".lbldescription").val());
                if ($("#required-input").prop("checked")) {
                    $(controlId).find('label:first-child').addClass("required-asterisk");
                } else {
                    $(controlId).find('label:first-child').removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).find("label").first().find("span.title").append('<span tabindex="0" data-toggle="tooltip"  data-placement="top"  title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).find("label").first().find("span.tooltipicon").remove();
                }
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($(".radiohorizontal").prop("checked")) {
                    $(controlId).removeClass("vertical");
                } else if ($(".radiovertical").prop("checked")) {
                    $(controlId).addClass("vertical");
                }
                if ($(".labeltop").prop("checked")) {
                    $(controlId).removeClass("f-g-left");
                    $(controlId).find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).addClass("f-g-left");
                    $(controlId).find('label:first-child').addClass("label-left");
                }

                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "select":
            var isrequired = $(controlId).parent().prev().hasClass("required-asterisk");
            var tooltiptext = $(controlId).parent().prev().find("span.tooltipicon").attr("data-original-title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).parent().prev().find("span.title").text();
            if (labelText == "Select") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().prev().find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }

            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';
            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            var isinputmd4 = $(controlId).hasClass("col-md-4") ? "selected" : "";
            var isinputmd6 = $(controlId).hasClass("col-md-6") ? "selected" : "";
            var isinputmd12 = $(controlId).hasClass("col-md-12") ? "selected" : "";
            if (isinputmd4 == "" && isinputmd6 == "" && isinputmd12 == "") isinputmd12 = "selected";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + isinputmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isinputmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isinputmd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label>Options<span class="addoptions" onclick="addoption(this)"><i class="fas fa-plus"></i></span></label>';
            popupString += '<div class="optionHeading"><label>Text</label><label>Value</label></div>';
            $(controlId).find('option').each(function (index, item) {
                if ($(item).val() == 0) {
                    popupString += '<div class="option-block  d-none">' +
                        '<div class="option-fields">' +
                        `<input type="text"  class="form-control option-text"  value="Select.." disabled/>` +
                        ' <input type="text" placeholder="Value" class="form-control option-value" disabled  value="0"/>' +
                        '</div>' +
                        '</div>'
                }
                else {
                    popupString += '<div class="option-block">' +
                        '<div class="option-fields">' +
                        `<input type="text" placeholder="Option Text" class="form-control option-text"  value="${($(item).text() == "option 2" || $(item).text() == "option 3") && $(controlId).attr("data-column") === undefined ? "" : $(item).text()}"/>` +
                        ' <input type="text" placeholder="Value" class="form-control option-value" disabled  value="' + $(item).val() + '"/>' +
                        '</div>' +
                        '<div class="popup-event-btn">' +
                        `<button class="event-btn file-remove" onclick="RemoveOption(this,'true')" ${index == 0 ? "disabled" : ""}><i class="fa fa-minus-circle" aria-hidden="true"></i></button >` +
                        '</div></div>'
                }
            });
            popupString += '</div></div> ';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var breakout = false;
                $('.option-block').each(function () {
                    if ($(this).find("input.option-value").val().trim() == '0' && $(this).find("input.option-text").val().trim() == 'Select..') {

                    } else {
                        if ($(this).find("input.option-text").val().trim() == '' || $(this).find("input.option-value").val().trim() == '') {
                            breakout = true;
                            return false;
                        }
                    }
                });
                if (breakout) {
                    breakout = false;
                    toastr.error("", "Options can not be empty", { progressBar: true });
                    return false;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }

                var allTextArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-text").val() != '')

                        return $(this).find("input.option-text").val()
                }).get();
                var duplicateTextArray = allTextArray.filter(function (element, pos) {
                    if (allTextArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                var allValueArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-value").val() != '')

                        return $(this).find("input.option-value").val()
                }).get();
                var duplicateValueArray = allValueArray.filter(function (element, pos) {
                    if (allValueArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                if (duplicateValueArray.length != 0) {
                    toastr.error("", "Option value can not be duplicate", { progressBar: true });
                    return;
                }
                if (duplicateTextArray.length != 0) {
                    toastr.error("", "Option text can not be duplicate", { progressBar: true });
                    return;
                }
                $(controlId).parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);
                $(controlId).html("");
                $(".option-block").each(function (index) {

                    var option_data = "<option value=" + $(this).find("input.option-text").val() + ">" + $(this).find("input.option-text").val() + "</option>";
                    $(option_data).appendTo('#' + ID);
                });
                if ($("#required-input").prop("checked")) {
                    $(controlId).parent().prev().addClass("required-asterisk");
                } else {
                    $(controlId).parent().prev().removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($("#fieldsize").val() == "col-md-12") {
                    $(controlId).removeClass("col-md-12");
                }
                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "priority":
            var tooltiptext = $(controlId).parent().prev().find("span.tooltipicon").attr("data-original-title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).parent().prev().find("span.title").text();
            if (labelText == "Priority") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().prev().find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }

            popupString = `<div class="modal-row custom-control custom-checkbox">`;
           
           
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';
            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            var isinputmd4 = $(controlId).hasClass("col-md-4") ? "selected" : "";
            var isinputmd6 = $(controlId).hasClass("col-md-6") ? "selected" : "";
            var isinputmd12 = $(controlId).hasClass("col-md-12") ? "selected" : "";
            if (isinputmd4 == "" && isinputmd6 == "" && isinputmd12 == "") isinputmd12 = "selected";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + isinputmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isinputmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isinputmd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label>Options<span class="addoptions" onclick="addoption(this)"><i class="fas fa-plus"></i></span></label>';
            popupString += '<div class="optionHeading"><label>Text</label><label></label></div>';
            $(controlId).find('li').each(function (index, item) {
                console.log($(item).val())
                if ($(item).val() == 0) return;
                popupString += '<div class="option-block">' +
                    '<div class="option-fields">' +
                    `<input type="text" placeholder="Option Text" class="form-control option-text" value="${($(item).text() == "option 1" || $(item).text() == "option 2") && $(controlId).attr("data-column") === undefined ? "" : $(item).text()}"/>` +
                    ' <input type="text" placeholder="Value" class="form-control option-value" disabled  value="' + $(item).val() + '"/>' +
                    '</div>' +
                    '<div class="popup-event-btn">' +
                    `<button class="event-btn file-remove" onclick="RemoveOption(this)" ${index == 0 ? "disabled" : ""}><i class="fa fa-minus-circle" aria-hidden="true"></i></button >` +
                    '</div></div>'
            });
            popupString += '</div></div> ';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var breakout = false;
                $('.option-block').each(function () {

                    if ($(this).find("input.option-text").val().trim() == '' || $(this).find("input.option-value").val().trim() == '') {
                        breakout = true;
                        return false;
                    }
                });
                if (breakout) {
                    breakout = false;
                    toastr.error("", "Options can not be empty", { progressBar: true });
                    return false;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }

                var allTextArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-text").val() != '')

                        return $(this).find("input.option-text").val()
                }).get();
                var duplicateTextArray = allTextArray.filter(function (element, pos) {
                    if (allTextArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                var allValueArray = $('.option-block').map(function () {
                    if ($(this).find("input.option-value").val() != '')

                        return $(this).find("input.option-value").val()
                }).get();
                var duplicateValueArray = allValueArray.filter(function (element, pos) {
                    if (allValueArray.indexOf(element) != pos) {
                        return true;
                    }
                    else {
                        return false;
                    }

                });
                if (duplicateValueArray.length != 0) {
                    toastr.error("", "Option value can not be duplicate", { progressBar: true });
                    return;
                }
                if (duplicateTextArray.length != 0) {
                    toastr.error("", "Option text can not be duplicate", { progressBar: true });
                    return;
                }
                $(controlId).parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);
                $(controlId).html("");
                $(".option-block").each(function (index) {
                    var option_data = "<li style='margin-bottom:5px' value=" + $(this).find("input.option-text").val() + ">" + $(this).find("input.option-text").val() + "</li>";
                    $(option_data).appendTo('#' + ID);
                });
                
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($("#fieldsize").val() == "col-md-12") {
                    $(controlId).removeClass("col-md-12");
                }
                $("#exampleModalCenter").modal("hide");
            });
            break;
        case "text":
            var isrequired = $(controlId).parent().prev().hasClass("required-asterisk");
            var tooltiptext = $(controlId).parent().prev().find("span.tooltipicon").attr("data-original-title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }

            var labelText = $(controlId).parent().prev().find("span.title").text();
            if (labelText == "Label") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().prev().find("span.desc").html();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;

            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
    <label class="custom-control-label" for="label-top">top</label></div>
    <div class="custom-control custom-radio d-inline-block mr-2">
    <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
    <label class="custom-control-label" for="label-left">left</label></div>
    </div>`;

            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';
            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                            <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                            <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var isfieldmd4 = $(controlId).hasClass("col-md-4") ? "selected" : "";
            var isfieldmd6 = $(controlId).hasClass("col-md-6") ? "selected" : "";
            var isfieldmd12 = $(controlId).hasClass("col-md-12") ? "selected" : "";
            if (isfieldmd4 == "" && isfieldmd6 == "" && isfieldmd12 == "") isfieldmd12 = "selected";


            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';

            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + isfieldmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isfieldmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isfieldmd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }
                $(controlId).parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);

                if ($("#required-input").prop("checked")) {
                    $(controlId).parent().prev().addClass("required-asterisk");
                } else {
                    $(controlId).parent().prev().removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($("#fieldsize").val() == "col-md-12") {
                    $(controlId).removeClass("col-md-12");
                }
                $("#exampleModalCenter").modal("hide");

            });
            break;
        case "textarea":
            var isrequired = $(controlId).parent().parent().prev().hasClass("required-asterisk");
            var tooltiptext = $(controlId).parent().parent().prev().find("span.tooltipicon").attr("data-original-title");
            tooltiptext = tooltiptext === undefined ? "" : tooltiptext;
            if (tooltiptext.indexOf("_blank") != -1) {
                var tooltipHtml = parseHTML(tooltiptext);
                $(tooltipHtml).find("a").replaceWith(function () {
                    return $("<span>" + $(this).html() + "</span>");
                });
                tooltiptext = tooltipHtml.textContent;
            }
            var labelText = $(controlId).parent().parent().prev().find("span.title").text();
            if (labelText == "Textarea") {
                labelText = "";
            }
            var lbldescriptionText = $(controlId).parent().parent().prev().find("span.desc").text();
            if (lbldescriptionText == undefined) {
                lbldescriptionText = "";
            }
            popupString = `<div class="modal-row custom-control custom-checkbox">`;
            if (isrequired) {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" checked>';
            } else {
                popupString += '<input type="checkbox" class="custom-control-input"  id="required-input" name="checkbox" >'
            }
            popupString += `<label class="custom-control-label" for="required-input">Required</label></div>`;
            popupString += `<div class="modal-row"><label>Label position: </label><div class="custom-control custom-radio d-inline-block mr-2">
                            <input type="radio" class="custom-control-input labeltop" id="label-top" name="radio-position" value="top" ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "" : "checked"}>
                            <label class="custom-control-label" for="label-top">top</label></div>
                            <div class="custom-control custom-radio d-inline-block mr-2">
                            <input type="radio" class="custom-control-input labelleft" id="label-left" name="radio-position" value="left"  ${ $(controlId).closest(".form-group").hasClass("f-g-left") ? "checked" : ""}>
                            <label class="custom-control-label" for="label-left">left</label></div>
                            </div>`;
            popupString += '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control lbltext" value="' + labelText + '"/>' +
                '</div>';

            if (tooltiptext != '') {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                                <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox" checked="">
                                <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext">' + tooltiptext + '</textarea>' +
                    '</div>';
            } else {
                popupString += `<div class="modal-row custom-control custom-checkbox">
                               <input type="checkbox" class="custom-control-input" id="help-input" name="checkbox">
                               <label class="custom-control-label" for="help-input">Enable help text</label></div>`;
                popupString += '<div class="modal-row">' +
                    '<label>Help Text</label>' +
                    '<textarea class="form-control lblhelptext"></textarea>' +
                    '</div>';
            }
            popupString += '<div class="modal-row">' +
                '<label>Description</label>' +
                '<textarea class="form-control lbldescription">' + lbldescriptionText + '</textarea>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + ismd12 + '>Large</option>' +
                '</select></div></div>';
            var isinputmd4 = $(controlId).closest(".ck-editor").hasClass("col-md-4") ? "selected" : "";
            var isinputmd6 = $(controlId).closest(".ck-editor").hasClass("col-md-6") ? "selected" : "";
            var isinputmd12 = $(controlId).closest(".ck-editor").hasClass("col-md-12") ? "selected" : "";
            if (isinputmd4 == "" && isinputmd6 == "" && isinputmd12 == "") isinputmd12 = "selected";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Input Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="inputsize">' +
                '<option value="col-md-4" ' + isinputmd4 + '>Small</option>' +
                '<option value="col-md-6" ' + isinputmd6 + '>Medium</option>' +
                '<option value="col-md-12" ' + isinputmd12 + '>Large</option>' +
                '</select></div></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".lbltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                if ($("#help-input").prop("checked") && $(".lblhelptext").val().trim() == "") {
                    toastr.error("", "Help text is required", { progressBar: true });
                    return;
                }
                if (isLabelNameExist($(".lbltext").val(), ID)) {
                    return;
                }
                var colname = $(".lbltext").val().trim();
                colname = colname.split(" ").join("").replace(/[_\W]+/g, "");
                 colname = shortenColName(colname);
                labelText = labelText.split(" ").join("").replace(/[_\W]+/g, "");
                if (colname != labelText && $(controlId).attr("data-column") === undefined) {
                    while (IsColumnNameExist(colname).responseJSON) {
                        var randomNumber = Math.floor((Math.random() * 100) + 1);
                        colname = colname + randomNumber;
                    }
                    $(controlId).attr("data-column", colname);
                }
                $(controlId).parent().parent().prev().html("").append(`<span class="title">${$(".lbltext").val().trim()}</span><span class="desc"></span>`);

                if ($("#required-input").prop("checked")) {
                    $(controlId).parent().parent().prev().addClass("required-asterisk");
                } else {
                    $(controlId).parent().parent().prev().removeClass("required-asterisk");
                }
                if ($("#help-input").prop("checked")) {
                    $(controlId).parent().parent().prev().find("span.title").append('<span  data-toggle="tooltip"  data-placement="top"   title="' + convertToUrl() + '" class="tooltipicon"><i class="far fa-question-circle"></i></span>');
                    toogleToolTip();

                } else {
                    $(controlId).parent().parent().prev().find("span.tooltipicon").remove();
                }
                $(controlId).parent().parent().prev().find("span.desc").html("").append($(".lbldescription").val());
                if ($(".labeltop").prop("checked")) {
                    $(controlId).closest(".form-group").removeClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').removeClass("label-left");
                } else if ($(".labelleft").prop("checked")) {
                    $(controlId).closest(".form-group").addClass("f-g-left");
                    $(controlId).closest(".form-group").find('label:first-child').addClass("label-left");
                }
                $(controlId).closest(".ck-editor").removeClass("col-md-4 col-md-6 col-md-12").addClass($("#inputsize").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12 invalid-field").addClass($("#fieldsize").val());
                if ($("#fieldsize").val() == "col-md-12") {
                    $(controlId).closest(".ck-editor").removeClass("col-md-12");
                }
                $("#exampleModalCenter").modal("hide");

            });
            break;
        default:
            var labelText = $(controlId).parent().parent().prev().find("label").html();
            popupString = '<div class="modal-row">' +
                '<label class="required-asterisk">Label Text</label>' +
                '<input  type="text"  class="form-control database-labeltext"  value="' + labelText + '"/>' +
                '</div>';
            var ismd4 = $(controlId).closest(".dragresize").hasClass("col-md-4") ? "selected" : "";
            var ismd6 = $(controlId).closest(".dragresize").hasClass("col-md-6") ? "selected" : "";
            var ismd12 = $(controlId).closest(".dragresize").hasClass("col-md-12") ? "selected" : "";
            popupString += '<div class="modal-row">' +
                '<label class="control-label"> Field Size </label>' +
                '<div class="form-group">' +
                '<select class="form-control"  id="fieldsize">' +
                '<option value="col-md-4" ' + ismd4 + '>Small</option>' +
                '<option value="col-md-6" ' + ismd6 + '>Medium</option>' +
                '<option value="col-md-12"  ' + ismd12 + '>Large</option>' +
                '</select></div>';
            popupString += '</div>';
            $("#btnSave").unbind();
            $("#btnSave").bind("click", function () {
                if ($(".database-labeltext").val().trim() == "") {
                    toastr.error("", "Label text is required", { progressBar: true });
                    return;
                }
                $(controlId).parent().parent().prev().find("label").html("").append($(".database-labeltext").val());
                $(controlId).closest(".dragresize").removeClass("col-md-4 col-md-6 col-md-12").addClass($("#fieldsize").val());
                $("#exampleModalCenter").modal("hide");
            });

            break;
    }
    $(".edithtml-body").html(popupString);
    if (type == "label") {
        $('.lbltext').summernote({
            placeholder: 'Type here ',
            height: 300,
            focus: true

        });
        $(".edithtml-dialog").css("max-width", "80%");
    } else {
        $(".edithtml-dialog").removeAttr("style");
    }
    if (type == "file") {
        $("#filetype").multiselect({
            includeSelectAllOption: true,
            nonSelectedText: 'Nothing selected',
            buttonWidth: '100%',
            maxHeight: 300
        });
        $("#filetype").closest('div').find('label').append('<span></span>');
        var selectedfiletype = $(controlId).attr("data-accept");
        if (selectedfiletype != undefined) {
            $("#filetype").val(selectedfiletype.split(','));
            $("#filetype").multiselect("refresh");
        }
    }


    $("#exampleModalCenter").modal("show");

}

//RemoveOption=>use to remove option of select,radio,checkbox inside popup
function RemoveOption(obj, isdropdown) {
    let len = $(obj).parent().parent().parent().find("div.option-block").length;
    if (len == 2 && isdropdown == 'true') return;
    if (len == 1) return;
    obj.closest(".option-block").remove();
};
//RemoveControl=>use to remove control from dropable section
function RemoveControl(obj) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure you want to remove this control',
        type: 'red',
        typeAnimated: true,
        buttons: {
            yes: {
                btnClass: 'btn-danger',
                action: function () {
                    var controls = $(obj).closest(".basecontentarea");
                    if (controls.find(".dragresize").length == 1) {
                        controls.next("span.basecontentspan").show();
                    }
                    obj.closest(".dragresize").remove();
                }
            },
            no: {

            }
        }
    });
}
//addoption=>use to add new option for select,radio,checkbox inside popup
function addoption(obj) {
    var optionvalue = parseInt($(obj).parent().siblings(".option-block").length) + 1;
    var popupString = '<div class="option-block">' +
        '<div class="option-fields">' +
        ' <input type="text" placeholder="Option Text" class="form-control option-text" />' +
        ' <input type="text" placeholder="Value" class="form-control option-value" disabled value="' + optionvalue + '"/>' +
        '</div>' +
        '<div class="popup-event-btn">' +
        '<button class="event-btn file-remove" onclick="RemoveOption(this)"> <i class="fa fa-minus-circle" aria-hidden="true"></i></button > ' +
        '</div></div>';
    $(obj).parent().siblings().last().after(parseHTML(popupString));
    $(obj).parent().siblings().last().find("input.option-text").focus();
}
//parseHTML=>use inside addoption function to add new block
function parseHTML(htmlstr) {
    var t = document.createElement('template');
    t.innerHTML = htmlstr;
    return t.content.cloneNode(true);
}
//isLabelNameExist=>use to validate duplicate column name
function isLabelNameExist(LabelName, controlid) {
    var isvalid = false;
    $("#droppable").find("input.form-control,input.custom-control-input,select.form-control,textarea.form-control").each(function (index, item) {
        var lbl = '';
        if ($(item).is("input")) {
            switch ($(item).attr("type")) {
                case "radio":
                case "checkbox":
                    if ($(item).attr("data-column") === undefined) break;
                    lbl = $(item).parent().parent().parent().prev().find("span.title").text();
                    break;
                default:
                    if ($(item).hasClass("database-field")) break;
                    lbl = $(item).parent().prev().find("span.title").text();
                    break;
            }
        }
        if ($(item).is("select")) {
            lbl = $(item).parent().prev().find("span.title").text();
        }
        if ($(item).is("textarea")) {
            lbl = $(item).parent().parent().prev().find("span.title").text();
        }

        if (lbl == LabelName && $(item).attr("id") != controlid) {
            toastr.error("", LabelName + " already exist", { progressBar: true });
            isvalid = true;
            return isvalid;
        }
    });
    return isvalid;
}
//saveHtml=>use to save template and create table in database for program
function saveHtml() {
    if ($("#droppable").find(".dragresize").length == 0) {
        toastr.error("", "Please drag field here", { progressBar: true });
        return;
    }
    var isvalid = true;
    $("#droppable").find("input.form-control,input.custom-control-input,select.form-control,textarea.form-control,.form-control.priority").each(function (index, item) {
        var colname = $(item).attr("data-column");
        if (typeof colname !== typeof undefined && colname !== false) {
        }
        else {
            if ($(item).is("input")) {
                switch ($(item).attr("type")) {
                    case "radio":
                    case "checkbox":
                        var datacol = $(item).parent().parent().find("input").first().attr("data-column");
                        if (typeof datacol !== typeof undefined && datacol !== false) {
                        } else {
                            $(item).closest(".dragresize").addClass("invalid-field");
                            isvalid = false;
                        }
                        break;
                    default:
                        if ($(item).hasClass("database-field")) return;
                        $(item).closest(".dragresize").addClass("invalid-field");
                        isvalid = false;
                        break;

                }
            }
            if ($(item).is("select")) {
                $(item).closest(".dragresize").addClass("invalid-field");
                isvalid = false;
            }
            if ($(item).is("textarea")) {
                $(item).closest(".dragresize").addClass("invalid-field");
                isvalid = false;
            }
            if ($(item).hasClass("priority")) {
                $(item).closest(".dragresize").addClass("invalid-field");
                isvalid = false;
            }
        }
    });
    if (!isvalid) {

        toastr.error("", "Enter required fields for controls", { progressBar: true });
        return;
    }
    $("#droppable .database-field").each(function (i, e) {
        return;
    });
    var gethtml = $("#droppable").html();

    var model = {
        TemplateID: $("#hdnTemplateId").val(),
        formName: formName,
        IsActive: 1,
        CreatedBy: userId,
        ModifiedBy: userId,
        IsBaseTemplate: true,
        ClientFormID: ClientFormID,

       
    };
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "POST",
        url: '/Client/SaveClientFormTemplate',
        data: JSON.stringify({ htmlTemplate: gethtml, Model: model}),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            
            var Res = JSON.parse(result.id);
            if (Res.TemplateID ==0 ) {
                toastr.error("Program Already Exist.");
                $(".loaderOverlay").hide();
                return false;
            } else {
                //templateId = result.id;
                $("#hdnTemplateId").val(Res.TemplateID);
                $(".hiddenSavedHtml").html("").append(gethtml);
            }

        }
    }).done(function (result) {
       
        var _result = JSON.parse(result.id);
        if (_result.TemplateID != 0) {
            var models = [];
            models.push({ ColDataType: "int", ColumnName: "PatientID" });
            var title = ''
            var type = ''
            var controlId=''
            $("#droppable [type=text]").each(function (index, item) {
                if ($(item).hasClass("database-field")) return;
                
                title = $(item).parents('.frmbtn').find('.title');
                type = $(item).attr('type')
                controlId = $(item).attr('id')
                models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
            });
            $("#droppable [type=number],[type=file],[type=date]").each(function (index, item) {
                title = $(item).parents('.frmbtn').find('.title');
                type = $(item).attr('type')
                controlId = $(item).attr('id')
                models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
            });
            $("#droppable select").each(function (index, item) {
                title = $(item).parents('.frmbtn').find('.title');
                type = $(item).attr('type')
                controlId = $(item).attr('id')
                models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
            });
            $("#droppable [type=radio]").each(function (index, item) {
                var radioitem = $(item).attr("data-column");
                if (typeof radioitem !== typeof undefined && radioitem !== false) {
                    title = $(item).parents('.frmbtn').find('.title');
                    type = $(item).attr('type')
                    controlId = $(item).attr('id')
                    models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
                }
            });
            $("#droppable [type=checkbox]").each(function (index, item) {
                var checkitem = $(item).attr("data-column");
                if (typeof checkitem !== typeof undefined && checkitem !== false) {
                    title = $(item).parents('.frmbtn').find('.title');
                    type = $(item).attr('type')
                    controlId = $(item).attr('id')
                    models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
                }
            });
            $("#droppable .priority").each(function (index, item) {
                title = $(item).parents('.frmbtn').find('.title');
                type = 'Priority'
                controlId = $(item).attr('id')
                models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
            });
            $("#droppable textarea").each(function (index, item) {
                title = $(item).parents('.frmbtn').find('.title');
                type = $(item).attr('type')
                controlId = $(item).attr('id')
                models.push({ ColDataType: "nvarchar(max)", ColumnName: $(item).attr("data-column"), Title: getTitle(title), type: type, ControlId: controlId });
            });

            var UniqueItems = models.reduce(function (item, e1) {
                var matches = item.filter(function (e2) { return e1.ColumnName == e2.ColumnName });
                if (matches.length == 0) {
                    item.push(e1);
                }
                return item;
            }, []);
           
            var model = {
                TableName: _result.TemplateTable,
                ColumnData: UniqueItems
            }
            $.ajax({
                type: "POST",
                url: Apipath + '/api/PatientMain/addClientFormtemplatecolumn',
                contentType: 'application/json; charset=UTF-8',
                data: JSON.stringify(model),
                dataType: "json",
                success: function (res) {
                    toastr.success("Saved successfully.");
                    $("a.preview").css("display", "inline");
                    //$("a.btndraft").css("display", "none");
                    //$("a.btnNeedsPopup").css("display", "inline");
                    sessionStorage.setItem("Id", _result.TemplateID);
                    $(".loaderOverlay").hide();
                },
            });
        }
    });
}
//GetFormHtmlById=>use to get template by template name
function GetFormHtmlById(Id) {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: '/Client/GetClientFormHtmlById?Id=' + Id,
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result.html != "") {
                $("#droppable").html(result.html);
                $(".hiddenSavedHtml").html("").append(result.html);
                HtmlControlDragnDrop();
            }
            toogleToolTip();
            initiatePriorityList()
            $(".loaderOverlay").hide();
        }
    });
}
function toogleToolTip() {
    $('.tooltipicon').tooltip({
        trigger: "click",
        html: true,
        container: 'body'
    });
    $('.tooltipicon').on('show.bs.tooltip', function () {
        $('.tooltipicon').not(this).tooltip('hide');
    });
    $('body').on('click', function (e) {
        if ($(e.target).data('toggle') !== 'tooltip' && $(e.target).parents('[data-toggle="tooltip"]').length === 0
            && $(e.target).parents('.tooltip.in').length === 0) {
            (($('[data-toggle="tooltip"]').tooltip('hide').data('bs.tooltip') || {}).inState || {}).click = false;
        }
    });
}
function validateFileSize(obj) {
    $(obj).bind('keyup paste', function () {
        this.value = this.value.replace(/[^0-9]/g, '');

    });
}
function IsColumnNameExist(colname) {
   
    var tableName = 'tbl_BaseClientFormTemplate';
           
    return $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/ClientFormiscolumnnameexist?TableName=' + tableName + '&ColumnName=' + colname,
        dataType: "json",
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (result) {

        }
    });
}
function convertToUrl() {
    var text = $(".lblhelptext").val();
    var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
    var text1 = text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
    var exp2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    return text1.replace(exp2, '$1<a target="_blank" href="http://$2">$2</a>');
}
function PreviewInPopUp() {
    $(".preview-body").html("").append($("#droppable").html());
    $(".preview-body .event-btn-right").remove();
    $(".preview-body .ck-editor-header").remove();
    $(".preview-body").find(".question-container").parent().css("border", "none");
    $(".preview-body").find(".dragresize").find(".question-container").remove();
    $(".preview-body").find(".dragresize").find(".bootom-form-row").css({ "padding": "0", "margin": "0" });
    $(".preview-body .html-content").prev().css("display", "none");
    $(".preview-body .html-content").parent().parent().parent().addClass("left-control");
    $(".preview-body .f-g-left").each(function (index, item) {
        $(item).parent().parent().addClass("left-control");
    });
    $('.preview-body textarea').bind('copy paste cut', function (e) {
        e.preventDefault();
    });
    $('.preview-body textarea').keypress(function (e) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var str = String.fromCharCode(!e.charCode ? e.which : e.charCode);
        if (regex.test(str)) {
            return true;
        }
        e.preventDefault();
        return false;
    });
    initiatePriorityList();
    toogleToolTip();
    $(".preview-body textarea.form-control").summernote({
        toolbar: [
            ['para', ['ul', 'ol', 'paragraph']],
            ['style', ['bold', 'italic', 'underline', 'clear']],
            ['font', ['strikethrough', 'superscript', 'subscript']],
        ],
        height: 150,
        placeholder: "Type here",
        callbacks: {
            onInit: function (e) {
                this.placeholder
                    ? e.editingArea.find(".note-placeholder").html(this.placeholder)
                    : e.editingArea.remove(".note-placeholder")
            }
        },
    });
    $('input[type=checkbox],input[type=radio]').unbind();
    $('input[type=checkbox],input[type=radio]').click(function (event) {
        var id = $(this).attr('id');
        var allCB = document.querySelectorAll(`input[id=${id}]`);
        for (var i = 0; i < allCB.length; i++) {
            allCB[i].checked = !allCB[i].checked;
        }
    });
    $("#PreviewModal").modal({
        show: true,
        keyboard: false,
        backdrop: 'static'
    });
}
function closePreview() {
    $('input[type=checkbox],input[type=radio]').unbind();
    $('#droppable').find('input[type="checkbox"],input[type="radio"]').click(function (event) {
        var $checkbox = $(this);
        setTimeout(function () {
            $checkbox.removeAttr('checked');
        }, 0);
        event.preventDefault();
        event.stopPropagation();
    });
    $("#PreviewModal").modal('hide');
}
function backToList() {
    $(".hiddenSavedHtml").find("div.dragresize").removeClass("ui-sortable-handle").removeAttr("style");
    $(".hiddenSavedHtml").find(".baseheader,.basefooter").removeClass("ui-sortable");
    $(".hiddenSavedHtml").find("span.basecontentspan").removeAttr("style");
    var savedHtml = $(".hiddenSavedHtml").html() == "" ? `
                                <input id="hdnbasetempid" hidden="hidden" class="basecontrol-id" type="text" value="0">
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basecontentarea contentarea1"></div>
                                        <span class="basecontentspan">Content area, you can not drop here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="baseheader basecontentarea"></div>
                                        <span class="basecontentspan">Base header, you can drop content here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basecontentarea contentarea2"></div>
                                        <span class="basecontentspan">Content area, you can not drop here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basefooter basecontentarea"></div>
                                        <span class="basecontentspan">Base footer, you can drop content here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basecontentarea contentarea3"></div>
                                        <span class="basecontentspan">Content area, you can not drop here</span>
                                    </div>
                                </div>
                            `: $(".hiddenSavedHtml")[0].innerHTML;
    var unsavedHtml = $("#droppable").clone();
    $(unsavedHtml).find("div.dragresize").removeClass("ui-sortable-handle").removeAttr("style");
    $(unsavedHtml).find(".baseheader,.basefooter").removeClass("ui-sortable");
    $(unsavedHtml).find("span.basecontentspan").removeAttr("style");
    unsavedHtml = unsavedHtml[0].innerHTML;
    if (savedHtml === unsavedHtml) {
        window.location.href = '/Client/ClientsFormList';
        $(".hiddenSavedHtml").html("");
    } else {
        $.confirm({
            icon: 'fas fa-exclamation-triangle',
            title: 'Confirm',
            content: 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?',
            type: 'red',
            columnClass: 'col-md-6 col-md-offset-3',
            typeAnimated: true,
            buttons: {
                stay: {
                    btnClass: 'btn-green',

                },
                leave: {
                    action: function () {
                        window.location.href = '/Client/ClientsFormList';
                        $(".hiddenSavedHtml").html("");
                    }
                }
            },

        });
    }
}
window.onbeforeunload = function (evt) {
    var message = "";
    $(".hiddenSavedHtml").find("div.dragresize").removeClass("ui-sortable-handle").removeAttr("style");
    $(".hiddenSavedHtml").find(".baseheader,.basefooter").removeClass("ui-sortable");
    $(".hiddenSavedHtml").find("span.basecontentspan").removeAttr("style");
    var savedHtml = $(".hiddenSavedHtml").html() == "" ? `
                                <input id="hdnbasetempid" hidden="hidden" class="basecontrol-id" type="text" value="0">
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basecontentarea contentarea1"></div>
                                        <span class="basecontentspan">Content area, you can not drop here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="baseheader basecontentarea"></div>
                                        <span class="basecontentspan">Base header, you can drop content here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basecontentarea contentarea2"></div>
                                        <span class="basecontentspan">Content area, you can not drop here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basefooter basecontentarea"></div>
                                        <span class="basecontentspan">Base footer, you can drop content here</span>
                                    </div>
                                </div>
                                <div class="dragresize col-md-12">
                                    <div class="contentbtn">
                                        <div class="basecontentarea contentarea3"></div>
                                        <span class="basecontentspan">Content area, you can not drop here</span>
                                    </div>
                                </div>
                            `: $(".hiddenSavedHtml")[0].innerHTML;

    var unsavedHtml = $("#droppable").clone();
    $(unsavedHtml).find("div.dragresize").removeClass("ui-sortable-handle").removeAttr("style");
    $(unsavedHtml).find(".baseheader,.basefooter").removeClass("ui-sortable");
    $(unsavedHtml).find("span.basecontentspan").removeAttr("style");
    unsavedHtml = unsavedHtml[0].innerHTML;
    if (savedHtml != unsavedHtml) {
        message = 'You have unsaved changes on this page. Do you want to leave this page and discard your changes or stay on this page?'
        if (typeof evt == 'undefined') {
            evt = window.event;
        }
        if (evt) {
            evt.returnValue = message;
        }
        return message
    }

}