// CÓDIGO EXACTO PARA COPIAR Y PEGAR EN GITHUB
// Reemplaza las líneas 313-403 del comando $vc en bot.js

                } else {
                    // Unirse al canal especificado (VERSIÓN CORREGIDA)
                    const channelName = args.join(' ');
                    const guild = message.guild;
                    
                    // Buscar canal de voz por nombre
                    const voiceChannel = guild.channels.cache.find(channel => 
                        channel.type === 2 && // GUILD_VOICE
                        channel.name.toLowerCase().includes(channelName.toLowerCase())
                    );
                    
                    if (!voiceChannel) {
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('❌ Canal No Encontrado')
                            .setDescription(`No se encontró un canal de voz con el nombre "${channelName}"`)
                            .setColor('#ff0000')
                            .addFields(
                                { name: '🔍 Canales Disponibles', value: guild.voiceChannels.map(ch => ch.name).slice(0, 5).join('\n') || 'No hay canales de voz', inline: false },
                                { name: '💡 Sugerencia', value: `Usa un nombre más específico o verifica el nombre exacto.`, inline: false }
                            )
                            .setFooter({ text: `Uso: ${BOT_PREFIX}vc [nombre del canal]` })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [errorEmbed] });
                        return;
                    }
                    
                    try {
                        // Si el bot ya está en un canal, desconectarlo primero
                        if (message.guild.members.me.voice.channel) {
                            await message.guild.members.me.voice.disconnect();
                        }
                        
                        // El bot se conecta al canal especificado
                        await message.guild.members.me.voice.setChannel(voiceChannel.id);
                        
                        const successEmbed = new EmbedBuilder()
                            .setTitle('✅ Bot Unido al Canal')
                            .setDescription(`El bot se ha unido al canal de voz **${voiceChannel.name}**`)
                            .setColor('#00ff00')
                            .addFields(
                                { name: '📢 Anuncio', value: '¡El bot está ahora en este canal para monitoreo!', inline: false },
                                { name: '🔧 Estado', value: 'Monitoreo de audio activo', inline: true },
                                { name: '⚠️ Nota', value: 'Para que el bot monitoree, debe tener permisos de voz', inline: true }
                            )
                            .setFooter({ text: `Canal: ${voiceChannel.name} | ID: ${voiceChannel.id}` })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [successEmbed] });
                        
                    } catch (voiceError) {
                        console.error('Error conectando al canal de voz:', voiceError);
                        
                        const errorEmbed = new EmbedBuilder()
                            .setTitle('❌ Error de Conexión')
                            .setDescription(`No se pudo conectar al canal de voz.`)
                            .setColor('#ff0000')
                            .addFields(
                                { name: '🔧 Posibles Soluciones', value: '• Verificar permisos de voz\n• El canal puede estar lleno\n• El bot puede estar en cooldown', inline: false },
                                { name: '📞 Contacto', value: 'Si persiste el error, contacta al administrador', inline: false }
                            )
                            .setFooter({ text: 'Error: ' + voiceError.message })
                            .setTimestamp();
                        
                        await message.reply({ embeds: [errorEmbed] });
                    }
                }