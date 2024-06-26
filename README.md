# B2B Portal

Samkaup's very own business portal for customers that are in business with Samkaup. They are able to fetch invoices, add related parties to their accounting structure and even check their account balance.

### Development

1. Clone the repo
2. Install dependencies with `yarn`
3. Login to your supabase instance
4. Link Supabase to your project using `yarn supabase link --project-ref <project-ref>`. You can get your project ref from the Supabase Project dashboard (Project Settings -> API)
5. Duplicate `.env.local.example` and rename it to `.env.local` and add the Project ref, Supabase URL and anon key.
6. Push the database schema to your Supabase project using `yarn supabase db push`.
7. Generate types for your Supabase tables using `yarn generate:types:local`.
8. Run `yarn dev` to start the development server.

## Features Nextbase

- 🚀 Next.js 13 with async components
- 💻 Data fetching examples in React server and client components. Suspenseful data fetching with minimal loading screens.
- ⚛️ React query setup configured
- 🔥 React Hot Toast component
- 💻 Fully typed with Typescript. Includes automatic type generation for Supabase tables
- 🎨 Tailwindcss
- 🧪 Unit testing and integration testing setups built-in
- 💚 Eslint, typescript, prettier, postcss configured for dev and test environments
- 📈 Automatic sitemap generation
- 🔍 SEO metadata, JSON-LD and Open Graph tags with NEXT SEO
- ✍️ Semantic release with Automatic changelog generation
- 🎨 Prettier Code formatter
- 💎 Minimal styling
- 📖 Codebase which is easy to read and modify

### Testing

1. Unit test using `yarn test`
2. End-to-end test using `yarn test:e2e`

### Deployment

We use Vercel for deployment

### Troubleshooting

Checkout the [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) file for common issues.
