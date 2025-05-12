const nextConfig = {
  reactStrictMode: true,
  // Garantir que o Next.js escute em todos os IPs
  server: {
    host: '0.0.0.0', // Ouvindo em todos os IPs
  },
  webpack(config, { isServer }) {
    // Permite a configuração do Webpack no Next.js
    if (!isServer) {
      config.resolve.fallback = {
        fs: false, // Evita erro de dependências do Next.js ao rodar no Docker
      }
    }
    return config
  },
}

module.exports = nextConfig

