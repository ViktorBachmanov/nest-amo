window.onload = function () {
  const formEl = document.forms[0];
  formEl.onsubmit = (e) => {
    e.preventDefault();

    const name = formEl.elements.first_name;
    const family = formEl.elements.last_name;
    const fam_name = family + ' ' + name;
    //console.log(name);

    fetch('/contact/find', {
      method: 'GET',
      // bosy: JSON.stringify({
      //   fam_name,
      // })
    })
      .then((response) => response.text())
      .then((text) => (document.body.innerHTML = text));
  };
};
