var __decorate = this && this.__decorate || function(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for(var i = decorators.length - 1; i >= 0; i--)if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inVC, sameVC, validVC } from "../../utils/decorators/MusicUtil";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
export let VolumeCommand = class VolumeCommand extends BaseCommand {
    execute(ctx) {
        const volume = Number(ctx.args[0] ?? ctx.options?.getNumber("volume", false));
        const current = ctx.guild.queue.volume;
        if (isNaN(volume)) {
            return ctx.reply({
                embeds: [
                    createEmbed("info", `🔊 **|** ${i18n.__mf("commands.music.volume.currentVolume", {
                        volume: `\`${current}\``
                    })}`).setFooter({
                        text: i18n.__("commands.music.volume.changeVolume")
                    })
                ]
            });
        }
        if (volume <= 0) {
            return ctx.reply({
                embeds: [
                    createEmbed("warn", i18n.__mf("commands.music.volume.plsPause", {
                        volume: `\`${volume}\``
                    }))
                ]
            });
        }
        if (volume > 100) {
            return ctx.reply({
                embeds: [
                    createEmbed("error", i18n.__mf("commands.music.volume.volumeLimit", {
                        maxVol: "`100`"
                    }), true)
                ]
            });
        }
        ctx.guild.queue.volume = volume;
        return ctx.reply({
            embeds: [
                createEmbed("success", `🔊 **|** ${i18n.__mf("commands.music.volume.newVolume", {
                    volume
                })}`)
            ]
        });
    }
};
__decorate([
    inVC,
    validVC,
    sameVC
], VolumeCommand.prototype, "execute", null);
VolumeCommand = __decorate([
    Command({
        aliases: [
            "vol"
        ],
        description: i18n.__("commands.music.volume.description"),
        name: "volume",
        slash: {
            options: [
                {
                    description: i18n.__("commands.music.volume.slashDescription"),
                    name: "volume",
                    type: "NUMBER",
                    required: false
                }
            ]
        },
        usage: i18n.__("commands.music.volume.usage")
    })
], VolumeCommand);
