# Introducción

Este es un proyecto para participar en la hackathon de twilio para julio del 2022 propuesta por midudev

# Configuración adicional

Para poder ejecutar el proyecto es necesario tener una cuenta en twilio, con un servicio de conversación iniciado, a su vez una cuenta en supabase igualmente con un proyecto creado. Después de debe crear un archivo .env con las siguiente estructura:

VITE_PUBLIC_SUPABASE_URL="xxxxx"
VITE_PUBLIC_SUPABASE_KEY="xxxxx" 


VITE_PUBLIC_ACCOUNT_SID="xxxx"
VITE_PUBLIC_API_KEY="xxxx"
VITE_PUBLIC_API_SECRET="xxxx"
VITE_PUBLIC_SERVICE_SID="xxxx"
VITE_PUBLIC_AUTH_TOKEN="xxxx" 


VITE_PUBLIC_ROLE_CHANNEL_USER="xxxx"
VITE_PUBLIC_ROLE_CHANNEL_ADMIN="xxxx"
VITE_PUBLIC_ROLE_SERVICE_USER="xxxx"
VITE_PUBLIC_ROLE_SERVICE_ADMIN="xxxx"


# create-svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npm init svelte

# create a new project in my-app
npm init svelte my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
