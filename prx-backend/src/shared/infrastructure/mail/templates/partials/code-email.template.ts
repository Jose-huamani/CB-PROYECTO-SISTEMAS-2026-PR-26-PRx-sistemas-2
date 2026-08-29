interface CodeEmailTemplateParams {
  badge?: string;
  title: string;
  description: string;
  code: string;
  expirationText: string;
  helperText: string;
}

export function codeEmailTemplate({
  badge,
  title,
  description,
  code,
  expirationText,
  helperText,
}: CodeEmailTemplateParams): string {
  return `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
      <tr>
        <td align="left">
          ${
            badge
              ? `
                <div style="margin-bottom:20px;">
                  <span style="display:inline-block;background-color:#eef7f6;color:#2D736C;font-size:13px;font-weight:600;padding:6px 12px;border-radius:999px;">
                    ${badge}
                  </span>
                </div>
              `
              : ''
          }

          <h2 style="margin:0 0 8px;font-size:24px;font-weight:600;line-height:1.3;color:#255f59;">
            ${title}
          </h2>

          <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#5c6f7e;">
            ${description}
          </p>

          <div
            class="dark-code-box"
            style="background-color:#eef7f6;border:1px solid #afd8d2;border-radius:16px;padding:24px 16px;text-align:center;margin-bottom:24px;"
          >
            <span style="display:inline-block;font-size:36px;font-weight:700;letter-spacing:8px;color:#2D736C;font-family:'SF Mono','Monaco','Inconsolata','Fira Mono','Droid Sans Mono','Courier New',monospace;">
              ${code}
            </span>
          </div>

          <p style="margin:0 0 20px;font-size:14px;line-height:1.6;color:#5c6f7e;">
            ${expirationText}
          </p>

          <div style="background-color:#f8fbfb;border-left:3px solid #32A690;border-radius:0 12px 12px 0;padding:12px 16px;">
            <p style="margin:0;font-size:13px;line-height:1.6;color:#6f808b;">
              ${helperText}
            </p>
          </div>
        </td>
      </tr>
    </table>
  `;
}
