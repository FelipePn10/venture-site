/**
 * Chaves de funcionalidade do site.
 *
 * São constantes de build (não env vars) de propósito: o Next elimina o código
 * morto na compilação e nada some do repositório — a funcionalidade fica pronta,
 * só desligada.
 */

/**
 * Demonstração gravada (/demo).
 *
 * Enquanto os vídeos não existirem, a rota responde 404 e nenhuma menção à
 * demonstração gravada aparece no site: some do menu, do botão flutuante, do
 * rodapé, das páginas de módulo, de /agendar, do diagnóstico e do FAQ.
 * Para reativar tudo de uma vez, troque para `true`.
 */
export const DEMO_VIDEOS_ENABLED = false;
