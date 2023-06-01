createBallEvent = function() {
  let ball_event = new THREE.Mesh(ball_event_geom, ball_event_material);
  ball_event.position.x = 2;

  return ball_event;
}
