function confirmtab() {
    const selectElement = document.querySelector('#tabselect');
    const selectedValue = selectElement.value;
    localStorage.setItem('sitefortab', selectedValue);
    localStorage.setItem('tabselectIndex', selectElement.selectedIndex);
    alert("Panic Site Updated To " + localStorage.getItem('sitefortab'));
    location.reload()
}
