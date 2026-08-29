export function baseLayout(content: string): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>PRX</title>
</head>
<body style="margin:0;padding:0;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;background-color:#f2f7f7;color:#3C4C59;line-height:1.5;">
  <center class="dark-bg-outer" style="width:100%;table-layout:fixed;background-color:#f2f7f7;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="width:100%;max-width:600px;margin:0 auto;background-color:#f2f7f7;" width="100%">
      <tr>
        <td style="padding:24px 16px;" align="center">

          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:24px;" width="100%">
            <tr>
              <td align="center">
                <img src="cid:prx-logo" alt="PRX Logo" style="max-width:120px;height:auto;display:block;margin:0 auto;" />
              </td>
            </tr>
          </table>

          <table
            class="dark-card"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
            style="width:100%;background:#ffffff;border-radius:20px;box-shadow:0 10px 24px rgba(45,115,108,0.06);"
            width="100%"
          >
            <tr>
              <td style="padding:32px 24px;" align="left">
                ${content}
              </td>
            </tr>
          </table>

          <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:24px;" width="100%">
            <tr>
              <td align="center">
                <hr class="dark-hr" style="width:60px;border:none;border-top:2px solid #afd8d2;margin:0 auto 16px;">
                <p class="dark-text-secondary" style="margin:0;font-size:12px;color:#6f808b;">
                  © ${new Date().getFullYear()} PRX · Gestión de Realidades
                </p>
                <p class="dark-text-secondary" style="margin:8px 0 0;font-size:11px;color:#94a8b0;">
                  Este es un correo automático, por favor no respondas a este mensaje.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </center>

  <style>
    @media (prefers-color-scheme: dark) {
      body, table, td, div, p, h1, h2, h3, span {
        color-scheme: dark;
      }

      body {
        background-color: #102927 !important;
        color: #d9e5e5 !important;
      }

      .dark-bg-outer {
        background-color: #102927 !important;
      }

      .dark-card {
        background-color: #183f3b !important;
        box-shadow: 0 10px 24px rgba(0,0,0,0.25) !important;
      }

      .dark-text-primary {
        color: #e7efef !important;
      }

      .dark-text-secondary {
        color: #94a8b0 !important;
      }

      .dark-code-box {
        background-color: #1f4f4a !important;
        border: 1px solid #255f59 !important;
      }

      .dark-hr {
        border-top-color: #255f59 !important;
      }
    }
  </style>
</body>
</html>
  `;
}
