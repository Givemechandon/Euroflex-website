$(document).ready(function () {
  $("body").on("click", ".vtexIdUI .modal-header .close", function (e) {
    e.preventDefault();

    window.location.href = "/";
  });
});

$(window).load(function () {
  console.log("Len: ", $(".vtexIdUI-providers-btn").length);

  $(".vtexIdUI-providers-btn").removeAttr("tabindex");
});
