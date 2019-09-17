var color = function (value) {
  if (value < 20) {
    return "#5ee432"; // green
  } else if (value < 40) {
    return "#fffa50"; // yellow
  } else if (value < 60) {
    return "#f7aa38"; // orange
  } else {
    return "#ef4655"; // red
  }
}
