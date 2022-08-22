# Whosonduty

A simple discord bot to forward messages in a specific channel to people responsible for answering.

Just set up a new /rotation and tag people who will participate. You'll need to specify rotation length and rotation start date also.

Once the rotation is configured, every message not belonging to rotation's participants in the channel will create a new thread and tag the current rotation participant to
answer it.

## Commands

`/ping` will respond pong, if bot is up & running.

`/rotation` will start rotation wizard. If a rotation already exists for that text channel, it'll notice you about it.

`/allowed-users` only the guild owner is allowed to create or update rotations. Allowed users let's the guild creator add people to manage rotations.

### Soon

`/add-responsible` add's a responsible to channel rotation. It will be added at the end of current rotation queue.

`/delete-responsible` removes a responsible from current rotation queue.

`/delete-rotation` deletes channel rotation.

`/add-users` will define which users are allowed to answers questions in the channel.
