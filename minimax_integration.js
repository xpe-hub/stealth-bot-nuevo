// MiniMax API Integration for Discord Bot
// MiniMax-M2 Agentic Model Integration

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const OpenAI = require('openai');

// Configure MiniMax API client (compatible with OpenAI SDK)
const minimaxClient = new OpenAI({
  apiKey: process.env.MINIMAX_API_KEY, // You'll need to set this
  baseURL: 'https://api.minimax.io/v1' // International endpoint
});

// MiniMax-M2 Configuration
const MINIMAX_MODEL = 'MiniMax-M2';
const MINIMAX_STABLE_MODEL = 'MiniMax-M2-Stable';

// Tool definitions for Discord bot functions
const discordTools = [
  {
    type: "function",
    function: {
      name: "join_voice_channel",
      description: "Join the user's current voice channel or a specified channel",
      parameters: {
        type: "object",
        properties: {
          channel_id: {
            type: "string",
            description: "Voice channel ID to join (optional, uses user's current channel if not provided)"
          },
          channel_name: {
            type: "string", 
            description: "Voice channel name to search for and join"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "create_discord_channel",
      description: "Create a new Discord channel in the server",
      parameters: {
        type: "object",
        properties: {
          channel_name: {
            type: "string",
            description: "Name for the new channel"
          },
          channel_type: {
            type: "string",
            enum: ["TEXT", "VOICE", "STAGE"],
            description: "Type of channel to create"
          },
          category_id: {
            type: "string",
            description: "Category ID to place the channel under"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "get_server_stats",
      description: "Get statistics about the Discord server",
      parameters: {
        type: "object",
        properties: {
          stat_type: {
            type: "string",
            enum: ["members", "channels", "activity", "roles"],
            description: "Type of statistics to retrieve"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "moderate_user",
      description: "Perform moderation actions on a user",
      parameters: {
        type: "object",
        properties: {
          user_id: {
            type: "string",
            description: "Discord user ID to moderate"
          },
          action: {
            type: "string",
            enum: ["warn", "timeout", "kick", "ban"],
            description: "Moderation action to perform"
          },
          reason: {
            type: "string",
            description: "Reason for the moderation action"
          },
          duration: {
            type: "string",
            description: "Duration for timeout (e.g., '1h', '24h')"
          }
        }
      }
    }
  }
];

// External API tools for enhanced functionality
const externalTools = [
  {
    type: "function",
    function: {
      name: "get_weather",
      description: "Get current weather for a location",
      parameters: {
        type: "object",
        properties: {
          location: {
            type: "string",
            description: "City and country, e.g., 'Madrid, Spain'"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Search the web for current information",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Search query"
          },
          limit: {
            type: "number",
            description: "Number of results to return (default 5)"
          }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "translate_text",
      description: "Translate text to another language",
      parameters: {
        type: "object",
        properties: {
          text: {
            type: "string",
            description: "Text to translate"
          },
          target_language: {
            type: "string",
            description: "Target language code (e.g., 'es', 'en', 'fr')"
          }
        }
      }
    }
  }
];

// Combine all tools
const allTools = [...discordTools, ...externalTools];

// MiniMax AI Chat Function
async function minimaxChat(message, context = {}) {
  try {
    const messages = [
      {
        role: "system",
        content: `Eres un asistente de Discord súper inteligente con capacidades agentic. 
                 Tienes acceso a herramientas de Discord y APIs externas.
                 Responde de manera útil, concisa y amigable.
                 
                 Contexto del servidor: ${JSON.stringify(context)}
                 
                 Herramientas disponibles: ${JSON.stringify(allTools.map(t => t.function.name))}`
      },
      {
        role: "user",
        content: message
      }
    ];

    const response = await minimaxClient.chat.completions.create({
      model: MINIMAX_MODEL,
      messages: messages,
      tools: allTools,
      stream: false,
      max_tokens: 2000,
      temperature: 0.7,
      extra_body: {
        reasoning_split: true // Enable interleaved thinking for developer-friendly output
      }
    });

    return response;
  } catch (error) {
    console.error('MiniMax API Error:', error);
    return null;
  }
}

// Process MiniMax responses with tool calls
async function processMinimaxResponse(response, guild, message) {
  if (!response.choices?.[0]?.message) return null;

  const choice = response.choices[0].message;
  const content = choice.content || '';
  const toolCalls = choice.tool_calls || [];

  // Log reasoning if available
  if (response.choices[0]?.reasoning_details) {
    console.log('🤖 MiniMax Reasoning:', response.choices[0].reasoning_details);
  }

  // Execute tool calls
  for (const toolCall of toolCalls) {
    const toolName = toolCall.function.name;
    const toolArgs = JSON.parse(toolCall.function.arguments || '{}');
    
    console.log(`🔧 Executing tool: ${toolName} with args:`, toolArgs);
    
    try {
      await executeDiscordTool(toolName, toolArgs, guild, message);
    } catch (error) {
      console.error(`Tool execution error for ${toolName}:`, error);
    }
  }

  return content;
}

// Execute Discord-specific tools
async function executeDiscordTool(toolName, args, guild, message) {
  switch (toolName) {
    case 'join_voice_channel':
      await executeVoiceJoin(args, guild, message);
      break;
    case 'create_discord_channel':
      await executeChannelCreation(args, guild, message);
      break;
    case 'get_server_stats':
      await executeServerStats(args, guild, message);
      break;
    case 'moderate_user':
      await executeModeration(args, guild, message);
      break;
    case 'get_weather':
      await executeWeatherQuery(args, message);
      break;
    case 'search_web':
      await executeWebSearch(args, message);
      break;
    case 'translate_text':
      await executeTranslation(args, message);
      break;
    default:
      console.log(`Unknown tool: ${toolName}`);
  }
}

// Voice Channel Tool Implementation
async function executeVoiceJoin(args, guild, message) {
  try {
    const user = message.member;
    if (!user.voice?.channel) {
      await message.reply('❌ No estás conectado a ningún canal de voz.');
      return;
    }

    const voiceChannel = user.voice.channel;
    await guild.members.me.voice.setChannel(voiceChannel.id);
    await message.reply(`🎤 Me he unido al canal de voz: **${voiceChannel.name}**`);
  } catch (error) {
    console.error('Voice join error:', error);
    await message.reply('❌ Error al unirme al canal de voz.');
  }
}

// Channel Creation Tool Implementation
async function executeChannelCreation(args, guild, message) {
  try {
    const { channel_name, channel_type = 'TEXT', category_id } = args;
    
    let channelType = 0; // Default to text
    switch (channel_type.toUpperCase()) {
      case 'VOICE':
        channelType = 2;
        break;
      case 'STAGE':
        channelType = 13;
        break;
      default:
        channelType = 0; // Text
    }

    const channelData = {
      name: channel_name,
      type: channelType
    };

    if (category_id) {
      channelData.parentId = category_id;
    }

    const channel = await guild.channels.create(channelData);
    await message.reply(`✅ Canal creado: **${channel.name}** (${channel.type === 0 ? 'Texto' : 'Voz'})`);
  } catch (error) {
    console.error('Channel creation error:', error);
    await message.reply('❌ Error al crear el canal.');
  }
}

// Server Statistics Tool Implementation
async function executeServerStats(args, guild, message) {
  try {
    const { stat_type = 'members' } = args;
    
    let stats = {};
    switch (stat_type) {
      case 'members':
        stats.members = guild.memberCount;
        stats.online = guild.members.cache.filter(m => m.presence?.status === 'online').size;
        break;
      case 'channels':
        stats.text_channels = guild.channels.cache.filter(c => c.type === 0).size;
        stats.voice_channels = guild.channels.cache.filter(c => c.type === 2).size;
        break;
      case 'activity':
        stats.recent_messages = 100; // Simplified
        break;
      case 'roles':
        stats.roles = guild.roles.cache.size;
        break;
    }

    const statsText = Object.entries(stats)
      .map(([key, value]) => `• ${key.replace('_', ' ').toUpperCase()}: ${value}`)
      .join('\n');

    await message.reply(`📊 **Estadísticas del servidor:**\n${statsText}`);
  } catch (error) {
    console.error('Server stats error:', error);
    await message.reply('❌ Error al obtener estadísticas del servidor.');
  }
}

// Moderation Tool Implementation
async function executeModeration(args, guild, message) {
  try {
    const { user_id, action, reason = 'Sin razón especificada', duration } = args;
    
    // Check if user has permission
    if (!message.member.permissions.has('ModerateMembers')) {
      await message.reply('❌ No tienes permisos para moderar usuarios.');
      return;
    }

    const targetMember = await guild.members.fetch(user_id).catch(() => null);
    if (!targetMember) {
      await message.reply('❌ Usuario no encontrado.');
      return;
    }

    let responseMessage = '';
    
    switch (action) {
      case 'warn':
        await targetMember.send(`⚠️ Has sido warnado en ${guild.name}: ${reason}`);
        responseMessage = `⚠️ Usuario ${targetMember.user.tag} ha sido warnado.`;
        break;
      case 'timeout':
        const timeoutDuration = duration || '24h';
        await targetMember.timeout(parseTimeout(timeoutDuration) || 24 * 60 * 60 * 1000, reason);
        responseMessage = `⏰ Usuario ${targetMember.user.tag} ha sido muted por ${timeoutDuration}.`;
        break;
      case 'kick':
        await targetMember.kick(reason);
        responseMessage = `👢 Usuario ${targetMember.user.tag} ha sido kickeado.`;
        break;
      case 'ban':
        await targetMember.ban({ reason });
        responseMessage = `🔨 Usuario ${targetMember.user.tag} ha sido baneado.`;
        break;
      default:
        await message.reply('❌ Acción de moderación no válida.');
        return;
    }

    await message.reply(responseMessage);
  } catch (error) {
    console.error('Moderation error:', error);
    await message.reply('❌ Error durante la moderación.');
  }
}

// Helper function to parse timeout duration
function parseTimeout(duration) {
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  
  const value = parseInt(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
}

// External API Tool Implementations (Placeholder implementations)
async function executeWeatherQuery(args, message) {
  // Placeholder - would integrate with weather API
  await message.reply(`🌤️ Weather functionality will be implemented with external weather API integration.`);
}

async function executeWebSearch(args, message) {
  // Placeholder - would integrate with search API  
  await message.reply(`🔍 Search functionality will be implemented with external search API integration.`);
}

async function executeTranslation(args, message) {
  // Placeholder - would integrate with translation API
  await message.reply(`🌍 Translation functionality will be implemented with external translation API integration.`);
}

// Export functions for use in main bot
module.exports = {
  minimaxChat,
  processMinimaxResponse,
  executeDiscordTool,
  discordTools,
  externalTools
};