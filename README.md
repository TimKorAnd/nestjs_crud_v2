<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

Додатково написати роути:
- POST users/join-to-room
- POST users/leave-from-room
  І написати логіку дня них.
  
Розширити функціонал:
  - вибрати всі повідомлення для конкретного користувача
    .../rooms/usersin/:id (rooms.controller)

    
  - вибрати всіх користувачів для конкретної кімнати
    .../messages/byuser/:id (messages.controller)
    

  - вибрати всі кімнати які створив користувач
    .../rooms/byowner/:id (rooms.controller)
