import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const AppThemePreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#eef7f6',
      100: '#d7ebe8',
      200: '#afd8d2',
      300: '#87c4bc',
      400: '#5fb0a5',
      500: '#32A690',
      600: '#2D736C',
      700: '#255f59',
      800: '#1f4f4a',
      900: '#183f3b',
      950: '#102927',
    },
    colorScheme: {
      light: {
        surface: {
          0: '#ffffff',
          50: '#f8fbfb',
          100: '#f2f7f7',
          200: '#e7efef',
          300: '#d9e5e5',
          400: '#bcd0d0',
          500: '#94a8b0',
          600: '#6f808b',
          700: '#5c6f7e',
          800: '#4a5a67',
          900: '#3C4C59',
          950: '#26323b',
        },

        text: {
          primary: '#3C4C59',
          secondary: '#5c6f7e',
          inverted: '#ffffff',
        },

        formField: {
          hoverBorderColor: '{primary.500}',
          focusBorderColor: '{primary.600}',
        },
      },
    },

    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.200}',
      offset: '1px',
    },
  },

  components: {
    fileupload: {
      root: {
        borderRadius: '0.75rem',
      },

      basic: {
        gap: '0.5rem',
      },

      header: {
        borderRadius: '0.75rem 0.75rem 0 0',
        gap: '0.75rem',
        padding: '1rem',
      },

      content: {
        padding: '1rem',
        gap: '0.75rem',
      },

      file: {
        padding: '0.75rem',
        gap: '0.75rem',
      },

      fileList: {
        gap: '0.75rem',
      },

      progressbar: {
        height: '0.45rem',
      },

      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            color: '{text.primary}',
          },

          header: {
            background: '{surface.50}',
            color: '{text.primary}',
            borderColor: '{surface.300}',
          },

          content: {
            highlightBorderColor: '{primary.500}',
          },

          file: {
            borderColor: '{surface.300}',
          },
        },
      },
    },

    breadcrumb: {
      root: {
        padding: '0',
        background: 'transparent',
        gap: '0.5rem',
      },

      item: {
        borderRadius: '0.65rem',
        gap: '0.35rem',
      },

      colorScheme: {
        light: {
          item: {
            color: '{text.secondary}',
            hoverColor: '{primary.600}',
            icon: {
              color: '{text.secondary}',
              hoverColor: '{primary.600}',
            },
            focusRing: {
              width: '2px',
              style: 'solid',
              color: '{primary.200}',
              offset: '1px',
              shadow: 'none',
            },
          },

          separator: {
            color: '{surface.500}',
          },
        },
      },
    },

    menu: {
      root: {
        borderRadius: '0.9rem',
        shadow: '0 12px 30px rgba(45,115,108,0.12)',
      },

      list: {
        padding: '0.4rem',
        gap: '0.15rem',
      },

      item: {
        padding: '0.65rem 0.8rem',
        borderRadius: '0.65rem',
        gap: '0.5rem',
      },

      separator: {
        borderColor: '{surface.200}',
      },

      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            color: '{text.primary}',
          },

          item: {
            focusBackground: '{surface.100}',
            color: '{text.primary}',
            focusColor: '{primary.700}',
            icon: {
              color: '{text.secondary}',
              focusColor: '{primary.600}',
            },
          },

          submenuLabel: {
            background: '{surface.0}',
            color: '{text.secondary}',
            fontWeight: '600',
          },

          separator: {
            borderColor: '{surface.200}',
          },
        },
      },
    },

    avatar: {
      root: {
        width: '2rem',
        height: '2rem',
        fontSize: '0.85rem',
        borderRadius: '999px',
      },

      icon: {
        size: '0.9rem',
      },

      lg: {
        width: '2.5rem',
        height: '2.5rem',
        fontSize: '1rem',
        icon: {
          size: '1rem',
        },
      },

      xl: {
        width: '3rem',
        height: '3rem',
        fontSize: '1.15rem',
        icon: {
          size: '1.15rem',
        },
      },

      colorScheme: {
        light: {
          root: {
            background: '{primary.50}',
            color: '{primary.700}',
          },

          group: {
            borderColor: '{surface.0}',
          },
        },
      },
    },

    datatable: {
      root: {
        borderColor: '{surface.200}',
      },

      header: {
        padding: '0',
        borderWidth: '0',
      },

      headerCell: {
        padding: '0.85rem 1rem',
        gap: '0.5rem',
      },

      bodyCell: {
        padding: '0.85rem 1rem',
      },

      columnTitle: {
        fontWeight: '600',
      },

      rowToggleButton: {
        size: '2rem',
        borderRadius: '999px',
      },

      sortIcon: {
        size: '0.85rem',
      },

      colorScheme: {
        light: {
          root: {
            borderColor: '{surface.200}',
          },

          header: {
            background: 'transparent',
            borderColor: '{surface.200}',
            color: '{text.primary}',
          },

          headerCell: {
            background: '{surface.50}',
            hoverBackground: '{surface.100}',
            selectedBackground: '{primary.50}',
            borderColor: '{surface.200}',
            color: '{text.secondary}',
            hoverColor: '{text.primary}',
            selectedColor: '{primary.700}',
            focusRing: {
              width: '2px',
              style: 'solid',
              color: '{primary.200}',
              offset: '1px',
              shadow: 'none',
            },
          },

          row: {
            background: '{surface.0}',
            hoverBackground: '{primary.50}',
            color: '{text.primary}',
          },

          bodyCell: {
            borderColor: '{surface.200}',
            selectedBorderColor: '{primary.200}',
          },

          sortIcon: {
            color: '{text.secondary}',
            hoverColor: '{primary.600}',
          },

          rowToggleButton: {
            hoverBackground: '{primary.50}',
            color: '{text.secondary}',
            hoverColor: '{primary.600}',
            focusRing: {
              width: '2px',
              style: 'solid',
              color: '{primary.200}',
              offset: '1px',
              shadow: 'none',
            },
          },
        },
      },
    },

    button: {
      root: {
        borderRadius: '0.75rem',
        roundedBorderRadius: '999px',
        gap: '0.5rem',
        paddingX: '1.1rem',
        paddingY: '0.75rem',
        label: {
          fontWeight: '500',
        },
      },

      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{primary.600}',
              hoverBackground: '{primary.700}',
              activeBackground: '{primary.800}',
              borderColor: '{primary.600}',
              color: '{text.inverted}',
            },

            secondary: {
              background: '{primary.400}',
              hoverBackground: '{primary.500}',
              activeBackground: '{primary.600}',
              borderColor: '{primary.400}',
              color: '{text.inverted}',
              hoverColor: '{text.inverted}',
              activeColor: '{text.inverted}',
            },

            danger: {
              background: '#F26052',
              hoverBackground: '#e04a3c',
              activeBackground: '#c93f33',
              borderColor: '#F26052',
              color: '#ffffff',
            },

            contrast: {
              background: '{surface.900}',
              hoverBackground: '{surface.950}',
              borderColor: '{surface.900}',
              color: '{text.inverted}',
            },
          },

          outlined: {
            primary: {
              borderColor: '{primary.600}',
              color: '{primary.600}',
              hoverBackground: '{primary.50}',
            },
          },

          text: {
            primary: {
              color: '{primary.600}',
              hoverBackground: '{primary.50}',
            },
          },
        },
      },
    },

    select: {
      root: {
        borderRadius: '0.75rem',
      },

      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            hoverBorderColor: '{primary.500}',
            focusBorderColor: '{primary.600}',
            color: '{text.primary}',
            placeholderColor: '{text.secondary}',
          },

          overlay: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            borderRadius: '0.9rem',
            shadow: '0 12px 30px rgba(45,115,108,0.12)',
          },

          option: {
            focusBackground: '{surface.100}',
            selectedBackground: '{primary.50}',
            selectedFocusBackground: '{primary.100}',
            color: '{text.primary}',
            selectedColor: '{primary.700}',
          },
        },
      },
    },

    paginator: {
      colorScheme: {
        light: {
          root: {
            background: 'transparent',
            color: '{text.primary}',
          },

          navButton: {
            background: '{surface.0}',
            hoverBackground: '{surface.100}',
            selectedBackground: '{primary.600}',
            color: '{text.secondary}',
            selectedColor: '{text.inverted}',
            borderRadius: '999px',
          },

          currentPageReport: {
            color: '{text.secondary}',
          },
        },
      },
    },

    dialog: {
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            color: '{text.primary}',
            borderRadius: '1.25rem',
            shadow: '0 20px 50px rgba(15,23,42,0.18)',
          },
        },
      },
    },

    inputtext: {
      root: {
        borderRadius: '0.75rem',
        paddingX: '0.95rem',
        paddingY: '0.75rem',
        sm: {
          fontSize: '0.875rem',
          paddingX: '0.85rem',
          paddingY: '0.55rem',
        },
        lg: {
          fontSize: '1rem',
          paddingX: '1.05rem',
          paddingY: '0.9rem',
        },
      },
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            disabledBackground: '{surface.100}',
            filledBackground: '{surface.50}',
            filledHoverBackground: '{surface.100}',
            filledFocusBackground: '{surface.0}',
            borderColor: '{surface.400}',
            hoverBorderColor: '{primary.500}',
            focusBorderColor: '{primary.600}',
            invalidBorderColor: '#F26052',
            color: '{text.primary}',
            disabledColor: '{surface.500}',
            placeholderColor: '{text.secondary}',
            invalidPlaceholderColor: '#F26052',
            shadow: 'none',
          },
        },
      },
    },

    password: {
      colorScheme: {
        light: {
          icon: {
            color: '{text.secondary}',
          },
          overlay: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            borderRadius: '0.9rem',
            color: '{text.primary}',
            padding: '1rem',
            shadow: '0 12px 30px rgba(45,115,108,0.12)',
          },
          content: {
            gap: '0.75rem',
          },
          meter: {
            background: '{surface.200}',
            borderRadius: '999px',
            height: '0.45rem',
          },
          strength: {
            weakBackground: '#F26052',
            mediumBackground: '{primary.400}',
            strongBackground: '{primary.600}',
          },
        },
      },
    },

    card: {
      root: {
        borderRadius: '1rem',
      },
      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            borderRadius: '1rem',
            color: '{text.primary}',
            shadow: '0 10px 24px rgba(45,115,108,0.06)',
          },
          body: {
            padding: '1rem',
            gap: '0.75rem',
          },
          title: {
            fontSize: '1.15rem',
            fontWeight: '600',
          },
          subtitle: {
            color: '{text.secondary}',
          },
          caption: {
            gap: '0.5rem',
          },
        },
      },
    },

    inputotp: {
      root: {
        gap: '0.65rem',
      },
      input: {
        width: '3rem',
        sm: {
          width: '2.6rem',
        },
        lg: {
          width: '3.2rem',
        },
      },
    },

    textarea: {
      root: {
        borderRadius: '0.75rem',
        paddingX: '0.95rem',
        paddingY: '0.75rem',
        sm: {
          fontSize: '0.875rem',
          paddingX: '0.85rem',
          paddingY: '0.55rem',
        },
        lg: {
          fontSize: '1rem',
          paddingX: '1.05rem',
          paddingY: '0.9rem',
        },
      },

      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            disabledBackground: '{surface.100}',
            filledBackground: '{surface.50}',
            filledHoverBackground: '{surface.100}',
            filledFocusBackground: '{surface.0}',
            borderColor: '{surface.400}',
            hoverBorderColor: '{primary.500}',
            focusBorderColor: '{primary.600}',
            invalidBorderColor: '#F26052',
            color: '{text.primary}',
            disabledColor: '{surface.500}',
            placeholderColor: '{text.secondary}',
            invalidPlaceholderColor: '#F26052',
            shadow: 'none',
          },
        },
      },
    },

    confirmdialog: {
      content: {
        gap: '1rem',
      },

      icon: {
        size: '1.25rem',
        color: '{primary.600}',
      },

      colorScheme: {
        light: {
          content: {
            gap: '1rem',
          },

          icon: {
            size: '1.25rem',
            color: '{primary.600}',
          },
        },
      },
    },

    autocomplete: {
      root: {
        borderRadius: '0.75rem',
        paddingX: '0.95rem',
        paddingY: '0.75rem',
      },

      dropdown: {
        borderRadius: '0.75rem',
        width: '2.75rem',
        sm: {
          width: '2.5rem',
        },
        lg: {
          width: '3rem',
        },
      },

      overlay: {
        borderRadius: '0.9rem',
      },

      list: {
        padding: '0.4rem',
        gap: '0.15rem',
      },

      option: {
        padding: '0.65rem 0.8rem',
        borderRadius: '0.65rem',
      },

      emptyMessage: {
        padding: '0.75rem 0.9rem',
      },

      chip: {
        borderRadius: '999px',
      },

      colorScheme: {
        light: {
          root: {
            background: '{surface.0}',
            disabledBackground: '{surface.100}',
            filledBackground: '{surface.50}',
            filledHoverBackground: '{surface.100}',
            filledFocusBackground: '{surface.0}',
            borderColor: '{surface.400}',
            hoverBorderColor: '{primary.500}',
            focusBorderColor: '{primary.600}',
            invalidBorderColor: '#F26052',
            color: '{text.primary}',
            disabledColor: '{surface.500}',
            placeholderColor: '{text.secondary}',
            invalidPlaceholderColor: '#F26052',
            shadow: 'none',
          },

          dropdown: {
            background: '{surface.0}',
            hoverBackground: '{surface.100}',
            activeBackground: '{primary.50}',
            borderColor: '{surface.400}',
            hoverBorderColor: '{primary.500}',
            activeBorderColor: '{primary.600}',
            color: '{text.secondary}',
            hoverColor: '{primary.600}',
            activeColor: '{primary.700}',
          },

          overlay: {
            background: '{surface.0}',
            borderColor: '{surface.400}',
            color: '{text.primary}',
            shadow: '0 12px 30px rgba(45,115,108,0.12)',
          },

          option: {
            focusBackground: '{surface.100}',
            selectedBackground: '{primary.50}',
            selectedFocusBackground: '{primary.100}',
            color: '{text.primary}',
            focusColor: '{text.primary}',
            selectedColor: '{primary.700}',
            selectedFocusColor: '{primary.800}',
          },

          optionGroup: {
            background: '{surface.0}',
            color: '{text.secondary}',
            fontWeight: '600',
            padding: '0.65rem 0.8rem',
          },

          chip: {
            focusBackground: '{primary.50}',
            focusColor: '{primary.700}',
          },
        },
      },
    },
  },

  dialog: {
    root: {
      borderRadius: '1rem',
      shadow: '...',
    },
    header: {
      padding: '1.25rem 1.25rem 0.75rem',
      gap: '0.75rem',
    },
    content: {
      padding: '0 1.25rem 1rem',
    },
    footer: {
      padding: '0.75rem 1.25rem 1.25rem',
      gap: '0.75rem',
    },
    title: {
      fontSize: '1rem',
      fontWeight: '600',
    },
  },
});
