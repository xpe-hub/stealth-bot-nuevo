const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, AttachmentBuilder, MessageEmbed, Permissions, REST, Routes, Collection, User, Guild, ChannelType } = require('discord.js');
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const stealth_cheatx_ai = require('./stealth_cheatx_ai');
const { stealthSystem } = require('./stealth_cheatx_ai');
const fetch = require('node-fetch');

// ==== CONFIGURACIÓN ====
// Actualizado: 2025-11-28 10:23:19 - Force rebuild for Railway cache clear