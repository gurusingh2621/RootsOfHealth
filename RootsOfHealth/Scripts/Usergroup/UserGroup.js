$(function () {
    GetGroupList();
    sessionStorage.clear();
});
var CreatedGroups=[]
var _usergrouplistDataTable = '';
var _userDatatable = '';
var SelectedUsers = [];
var _groupName = '';
var _roleId = 0;
function GetGroupList() {
    $(".loaderOverlay").css("display", "flex");
    $.ajax({
        type: "GET",
        url: Apipath + '/api/PatientMain/getgrouplist',
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            var Grouplist = $(".grouplist");
            var Groups = "";
            if (result.length) {
                $.each(result, function (index, item) {
                    let group = {
                        ID: item.GroupID,
                        Name: item.GroupName
                    }
                    CreatedGroups.push(group)
                    Groups += `<tr>
                         <td width="15%">${(item.GroupName != null ? item.GroupName : "")}</td>
                         <td width="15%">${(item.RoleName != null ? item.RoleName : "")}</td>
                         <td width="15%">${item.CreatedDate != null ? item.CreatedDate.split("T")[0] : ""}</td>
                         <td width="15%">${item.ModifiedDate != null ? item.ModifiedDate.split("T")[0] : ""}</td>
                         <td width="10%">${(item.MemberCount == null ? 0 : item.MemberCount)}</td>
                            <td width="30%"><div>`;
                    Groups += `<a href="javascript:void(0)" onclick="ManageMembership(${item.GroupID},${item.RoleID},'${item.GroupName}')" class="btn btn-success text-white" style="cursor:pointer;">Manage Membership</a>`
                    Groups += `<a href="javascript:void(0)" onclick="DeleteGroup(${item.GroupID},this,${item.RoleID})" class="btn btn-success text-white" style="cursor:pointer;">Delete</a>`

                    Groups += `</div></td></tr>`;
                });
                Grouplist.html("").append(Groups);
            } else {
                Groups += `<tr><td colspan="6"><p class="text-center">No data found.</p></td>
                            <td style="display: none;"></td>
                            <td style="display: none;">/td>
                            <td style="display: none;"></td>
                            <td style="display: none;"></td>
                            <td style="display: none;"></td></tr>`;
                Grouplist.html("").append(Groups);
            }

            _usergrouplistDataTable = $('#tblGroupTemplateList').DataTable({
                retrieve: true,
                searching: false,
                'columnDefs': [{
                    'targets': [5],
                    'orderable': false
                }]
            });

            $(".loaderOverlay").hide();
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
        }
    });
}
function ManageMembership(groupid,roleid,groupname) {

    $.ajax({
        type: "GET",
        url: '/Account/AddGroup',
        dataType: "html",
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#CreateGroupModal .modal-body").html(result)
            LoadGroupMemberTable(groupid)
            LoadUserDropdown(groupid);
            LoadRoles(roleid);
            $('#CreateGroupModal').modal('show');
            $('#GroupName').val(groupname);
            $('#GroupId').val(groupid);
            _groupName = groupname;
            _roleId = roleid;
            $('#SaveGroupButton').prop('disabled', true);
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
        }
    });

}
$('#CreateGroup').click(function () {
    $.ajax({
        type: "GET",
        url: '/Account/AddGroup',
        dataType: "html",
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            $("#CreateGroupModal .modal-body").html(result)
            LoadGroupMemberTable(0)
            LoadUserDropdown(0);
            $('#GroupName').val("");
            $('#GroupId').val(0);
            LoadRoles();
        },
        error: function (e) {
            toastr.error("Something Happen Wrong");
        }
    });
});

function LoadRoles(roleid) {
    $.ajax({

        type: "Get",
        url: Apipath + '/api/PatientMain/roleslist',
        dataType: "json",
        async: true,
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            let options=`<option value="0">None</option>`
            $.each(result, function (index, item) {
                options += `<option value="${item.RoleID}">${item.RoleName}</option>`
            })

            $('#GroupRoles').html(options)
            if (roleid != null) {
                $('#GroupRoles').val(roleid)
            }
        },
        error: function () {
            toastr.error("Some error occurred!! or data not found");
        }
    });
}



function LoadUserDropdown(groupid) {
    $.ajax({
        type: "Get",
        url: Apipath + '/api/PatientMain/GetUsersDropDownByGroupId?groupid=' + groupid,
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function (result) {
            let options = '';
            $.each(result, function (index, item) {
                options += `<option data-tokens="${item.FirstName + ' ' + item.LastName + '(' + item.Email + ')'}"
                           value="${item.UserID}:${item.FirstName + ' ' + item.LastName}:${item.Email}:${item.Image}">
                            ${item.FirstName + ' ' + item.LastName + '(' + item.Email + ')'}
                           </option>`
            })
            $('#UsersToAdd').html(options);
            $('#UsersToAdd').selectpicker();
        },
        error: function () {
            toastr.error("Some error occurred!! or data not found");
        }
       
    });

}
    function LoadGroupMemberTable(groupid) {
        $.ajax({

            type: "Get",
            url: Apipath + '/api/PatientMain/getusersbygroupId?groupid=' + groupid,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function (result) {

                var Self = this;
                var Options=""
                $.each(result, function (index, item) {
                    let tdArray = CreateTableRow(item.UserID, item.FirstName + ' ' + item.LastName, item.Email, item.Image);
                    let option = `<tr>
                               <td>${tdArray[0]}</td>
                               <td>${tdArray[1]}</td>
                               <td>${tdArray[2]}</td>
                               </tr>`
                        Self.Options+= option;
                })

                $('#userlist tbody').html(this.Options);
                _userDatatable = $('#userlist').DataTable({
                    "searching": false,
                    "scrollY": "200px",
                    "paging": false,
                    'columnDefs': [{
                        'targets': [0],
                        'orderable': false
                    }]
                });
                IsDatatableEmpty();
            },
            error: function () {
                toastr.error("Some error occurred!! or data not found");
            }
           
        });
}


function AddMembersToTable() {
    for (let i = 0; i < SelectedUsers.length; i++) {
        var SelectedUser = SelectedUsers[i].split(':')
        let tdArray = CreateTableRow(SelectedUser[0], SelectedUser[1], SelectedUser[2], SelectedUser[3])
        _userDatatable.row.add([
            tdArray[0],
            tdArray[1],
            tdArray[2]
        ]).draw(true);
        $('#SaveGroupButton').prop('disabled', false);
    }
   
    $('#UsersToAdd option').each(function (index, element) {
        let val = $(element).val();
       
        if (SelectedUsers.includes(val)) {
            $(element).remove();
        }
    })
    RefreshSelectPicker()
    $('#AddSelectedUsers').prop('disabled', true);
    IsDatatableEmpty();
   
}

function CreateTableRow(id, name, email, image) {
    let cellarray = []
    cellarray.push(`<label class="input_checkbox"><input type="checkbox" onchange="onSelect()" name="userSelectedCheckBox" value="${id}"><span></span></label>`)
    cellarray.push(`<button type="button" class="btn btn-danger" data-UserID="${id}" data-UserName="${name}" data-UserEmail="${email}" data-UserImage="${image}" onClick="RemoveUser(this)">Remove</button>`)
    cellarray.push(`<div class="member_name">
            <div class= "member_img" >
                  <img  src="/Files/${image == '' ? 'profile.png' : image}" alt="Sample Image">
            </div>
            <div class="member_name_text">
                <strong>${name}</strong>
                <span>${email}</span>
               </div>
               </div>`)
    return cellarray;
}


function RemoveUser(btn) {
    var button = $(btn);
      var User=GetUserObject(btn);

    _userDatatable.row($(btn).parents('tr')).remove().draw();

    var option = `<option data-tokens="${User.userName + '(' + User.userEmail + ')'}"
                           value="${User.userId}:${User.userName}:${User.userEmail}:${User.userImage}">
                           ${User.userName + '(' + User.userEmail + ')'}
                           </option>`
    $('#UsersToAdd').append(option)
    RefreshSelectPicker()
    $('#SaveGroupButton').prop('disabled', false);
    IsDatatableEmpty();

}

function RemoveSelectedUsers() {
    $('#userlist').find('input[name="userSelectedCheckBox"]:checked').each(function (index,element) {
        element = $(element).parents('tr').find('button');
        let User = GetUserObject(element);
        var option = `<option data-tokens="${User.userName + '(' + User.userEmail + ')'}"
                           value="${User.userId}:${User.userName}:${User.userEmail}:${User.userImage}">
                           ${User.userName + '(' + User.userEmail + ')'}
                           </option>`
        $('#UsersToAdd').append(option);
        _userDatatable.row($(element).parents('tr')).remove().draw();

    });
    RefreshSelectPicker()
   
    $("#Select_All").prop('checked', false)
    $('#RemoveSelectedUsers').prop('disabled', true);
    $('#SaveGroupButton').prop('disabled', false);
    IsDatatableEmpty();
        
}

function GetUserObject(elem) {
    let element = $(elem)
    let User = {
        userName: element.attr('data-UserName'),
        userEmail: element.attr('data-UserEmail'),
        userImage: element.attr('data-UserImage'),
        userId: element.attr('data-UserID')
    }
    return User;
}


function SelectedOrDeselectAll(CheckBox)
{
    if ($(CheckBox).is(":checked")) {
        $('#userlist').find('input[name="userSelectedCheckBox"]').each(function () {
            $(this).prop('checked', true);
        })
        $('#RemoveSelectedUsers').prop('disabled', false);

    }
    else {
        $('#userlist').find('input[name="userSelectedCheckBox"]').each(function () {
            $(this).prop('checked', false);
        })
        $('#RemoveSelectedUsers').prop('disabled', true);
    }
   
}
function onSelect() {
    if ($('#userlist input[name="userSelectedCheckBox"]:checked').length > 0) {
        $('#RemoveSelectedUsers').prop('disabled', false);
    }
    else {
        $('#RemoveSelectedUsers').prop('disabled', true);
    }
}


function IsDatatableEmpty() {
    if (!_userDatatable.data().any()) {
        $("#Select_All").prop('disabled', true)
    }
    else {
        $("#Select_All").prop('disabled', false)
    }
}

function RefreshSelectPicker() {
    $('#UsersToAdd').selectpicker('refresh');
}



//save and update group
var isValid = true;
function SaveGroup() {

    isValid = true;
   let GroupModel= CreateAndValidateGroupModel();
   
    if (!isValid) {
        return
    }
    $(".loaderOverlay").show();
    $.ajax({
        type: "POST",
        url: Apipath + '/api/PatientMain/savegroup',
        data: JSON.stringify(GroupModel),
        contentType: 'application/json; charset=UTF-8',
        dataType: "json",
        success: function (result) {
            if (result == "0") {
                toastr.error("unexpected error Happened");
            }
            else {
                if (GroupModel.GroupID > 0) {
                    toastr.success("", "Updated successfully", { progressBar: true });
                }
                else {
                    toastr.success("", "Created successfully", { progressBar: true });
                }
                $('#CreateGroupModal').modal('hide');
            }
            $(".loaderOverlay").hide();
            window.location.href = '/Account/UserGroupList';


        }
    })
}
function CreateAndValidateGroupModel() {
    let UserList=[]
    $('#userlist input[name="userSelectedCheckBox"]').each(function (index, element) {
        UserList.push({ ID: $(element).val()});
    })
    let GroupId = $('#GroupId').val();
    let GroupName = $('#GroupName').val().trim();
    
    if (UserList.length <= 0) {
        toastr.error("Add atleast one user to group");
        isValid = false;
        return
    }
    else if (GroupName == '') {
        toastr.error("Please enter GroupName");
        isValid = false;
        return
    }

    
    let GroupNameDuplicate = GroupName.toLowerCase().replace(/ /g, ""); 
    $.each(CreatedGroups, function (index, item) {
        let ItemName = item.Name.toLowerCase().replace(/ /g, ""); 
        
        if (GroupId == 0 && ItemName == GroupNameDuplicate) {
            isValid = false;
            toastr.error("Duplicate group name is not allowed");
            return false;
        }
        else if (GroupId > 0 && GroupId != item.ID && ItemName == GroupNameDuplicate) {
            toastr.error("Duplicate group name is not allowed");
            return false;
        }
    })
    if (!isValid) {
        return;
    }
   

    let roleId = $('#GroupRoles').val() == 0 ? null : $('#GroupRoles').val();
    let model = {
        GroupID: GroupId,
        GroupName: GroupName,
        RoleID: roleId,
        CreatedBy: userId,
        ModifiedBy: userId,
        GroupUserIds:UserList
    }
    return model;
}


function DeleteGroup(groupid,btn,roleid) {
    $.confirm({
        icon: 'fas fa-exclamation-triangle',
        title: 'Confirm',
        content: 'Are you sure,you want to delete this group?',
        type: 'red',
        columnClass: 'col-md-6 col-md-offset-3',
        typeAnimated: true,
        buttons: {
            yes: {
                btnClass: 'btn-red',
                action: function () {
                    $.ajax({
                        type: "Post",
                        url: Apipath + '/api/PatientMain/deletegroup?groupid=' + groupid,
                        contentType: 'application/json; charset=UTF-8',
                        dataType: "json",
                        success: function (result) {
                            if (result > 0) {
                                toastr.success("", "Deleted Successfully", { progressBar: true });
                                if (roleid == "3") {
                                    location.href = "/Account/UserGroupList";
                                }
                                let index = CreatedGroups.findIndex(x => x.ID === groupid);
                                CreatedGroups.splice(index, 1);
                                _usergrouplistDataTable.row($(btn).parents('tr')).remove().draw();
                            }
                           
                        }
                    });
                }
            },
            no: function () {
            }
        }
    });
}


function detectChange() {
    if ($('#GroupName').val().trim() != _groupName.trim()) {
        $('#SaveGroupButton').prop('disabled', false);
    }
    else if (_roleId != $('#GroupRoles').val()) {
        $('#SaveGroupButton').prop('disabled', false);
    }


}







