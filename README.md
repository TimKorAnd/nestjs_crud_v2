<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest


Написати API на NestJs де буде 3 - и сутності:

    user = {
    name: String,
    email: String,
    password: String,
    roomId: ObjectId,
    }

    room = {
    title: String,
    ownerId: ObjectId,
    description: String,
    usersId: [ObjectId],
    }
    message = {
    ownerId: ObjectId,
    roomId: ObjectId,
    text: String,
    }

CRUD для кожної з них + валідація даних на рівні DTO.


Додатково написати роути:
- POST users/join-to-room
- POST users/leave-from-room
  І написати логіку дня них.
  
Розширити функціонал:
  - вибрати всі повідомлення для конкретного користувача
    .../messages/byuser/:id (messages.controller)

    
  - вибрати всіх користувачів для конкретної кімнати
    w/o populate .../rooms/usersin/:id (rooms.controller)
    with populate .../users/inroom/:id (users.controller)

  - вибрати всі кімнати які створив користувач
    .../rooms/byowner/:id (rooms.controller)
