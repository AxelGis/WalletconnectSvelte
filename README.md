# Команды

#### Установка зависимостей
```bash
npm install
```
#### Запуск проекта в dev режиме
```bash
npm run dev
```

#### Запуск проекта с доступом через удаленный адрес
```bash
npm run dev:host
```

#### Сборка проекта для production
```bash
npm run build
```
#### Превью production сборки
При запуске бекэнд необходимо запускать `dev` сборку. 
Также необходимо изменить в `.ops/.env/.env.dev` значение переменной FRONTEND_URL или аналогичной, 
которая добавляет фронтэнд в исключения для CORS. Значение по умолчанию должно поменяться 
c `http://localhost:5173` на `http://localhost:4173`.
* Запускать после `npm run build`.
```bash
npm run preview
```

#### Превью production сборки с доступом через удаленный адрес
* Запускать после `npm run build`.
```bash
npm run preview:host
```

#### Запуск линтера
```bash
npm run lint
```

#### Release
```bash
npm version patch -m 'v1.0.0'
git push --tags
```
Либо отправить тэг командой
```bash 
git push origin v1.0.0
```

#### Переключение тэгов
```bash
git checkout v1.0.0
```
Указанная выше команда выполнит переход к тегу `v1.0.0`. При этом репозиторий перейдет в состояние открепленного указателя HEAD. Это значит, что любые внесенные изменения не будут добавлены в этот тег. Они попадут в новый открепленный коммит, который не будет принадлежать ни к какой ветке, и перейти на него можно будет только напрямую по SHA-хешу этого коммита. Поэтому рекомендуется создавать новую ветку каждый раз, когда вы вносите изменения, находясь в состоянии открепленного указателя HEAD.

### Запуск на сервере
Для начала надо либо скачать docker/docker-compose.github.yml из репозитория, либо забрать репо через git

После необходимо создать Personal access token минимум с правами `read:packages`

Далее лучше добавить этот токен в переменные окружения
```bash
export CR_PAT=YOUR_TOKEN
```

После логинимся с помощью этого токена в GitHub
```bash
$ echo $CR_PAT | docker login ghcr.io -u <USERNAME> --password-stdin
> Login Succeeded
```
И запускаем docker compose:
```bash
docker compose -f docker-compose.github.yml up -d
```


### Разработка:
Добавить ENV переменную `VITE_API_URL='http://localhost:5173/api/v1'`, где адрес должен вести на dev vite server, на нем настроена прокси для решения проблем с CORS при локальной разработке и `BACKEND_URL='http://127.0.0.1:3030'`, где должен быть указан адрес backend части приложения
#### for dev build (from root):
```bash
docker compose -f docker/docker-compose.dev.yml up -d 
```

#### for prod build (from root):
```bash
docker compose -f docker/docker-compose.prod.yml up -d 
```

#### pull from github registry (from root):
```bash
docker compose -f docker/docker-compose.github.yml up -d 
```
