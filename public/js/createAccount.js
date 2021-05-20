const doAddGroup = (listGroupData, select = null) => {
    // moi lan select luu vao danh dach nay
    listGroup = updateGroupList(listGroupData)
    let groupSelect = document.createElement('select')
    groupSelect.className = 'group form-select form-select-sm'
    groupSelect.setAttribute('aria-label', ".form-select-sm")
    groupSelect.setAttribute('name', 'groupID')
    groupSelect.addEventListener('change', e => {
        listGroup = reloadGroupList(listGroupData)
        console.log(e.target.value)
    })
    if (select == null) select == listGroup[0].id
    for(i in listGroup){
        let element = document.createElement("option")
        if(i == 0) continue
        if(listGroup[i].id == select){
            element.selected = true
        }
        element.setAttribute('value', listGroup[i].id)
        element.innerHTML = listGroup[i].name
        groupSelect.appendChild(element)
    }

    selectGroupBox.appendChild(groupSelect)
}
const updateGroupList = (listGroupData) => {
    let selectList = []
    Array.prototype.forEach.call(document.getElementsByClassName('group'), (e) => {
        selectList.push(e.value)
    })
    return listGroupData.filter(f => !selectList.includes(f.id))
}  
const reloadGroupList = (listGroupData) => {
    let selectedList = []
    Array.prototype.forEach.call(document.getElementsByClassName('group'), (e) => {
        selectedList.push(e.value)
    })
    let listGroup = listGroupData.filter(f => !selectedList.includes(f.id))
    Array.prototype.forEach.call(document.getElementsByClassName('group'), (e) => {
        e.innerHTML = ''
        let currentValue = selectedList.shift()
        currentValue = listGroupData.filter(f => f.id == currentValue)[0]
        let currentList = listGroup.concat(currentValue)
        console.log(listGroup)
        for(i in currentList){
            let element = document.createElement("option")
            if(i == 0) continue
            if(currentList[i].id == currentValue.id){
                element.selected = true
            }
            element.setAttribute('value', currentList[i].id)
            element.innerHTML = currentList[i].name
            e.appendChild(element)
        }
    })

    
    return listGroup
}

window.onload = async () => {
    let {token, id, groupid: groupIDdata, success, msg} = getData()
    if(success=='-1'){
        $.notify(msg, "error");
    }else{
        $.notify(msg, "success");
    }

    let {error: errorGetGroup, data: listGroupData} = await getGroup(token)
    if(errorGetGroup.length > 0){
        console.log(`Error: ${errorGetGroup}`)
        $.notify(errorGetGroup, "error");
        return
    }
    listGroupData = listGroupData.map(m => ({name: m.name, id: m._id, leader: m.leader}))
    console.log(listGroupData)
    listGroupData = listGroupData.filter(f => f.leader == null)
    console.log(listGroupData)

    btn_addGroup.onclick = (e) => {
        e.preventDefault()
        doAddGroup(listGroupData)
    }
    let groupID = groupIDdata.split(',')

    if (groupID[0] == '')
        doAddGroup(listGroupData)
    else{
        groupID.forEach(e => {
            doAddGroup(listGroupData, e)
        })
    }
}