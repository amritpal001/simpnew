import { CommandContext } from "../../structures/CommandContext";
import { createEmbed } from "../../utils/functions/createEmbed";
import { BaseCommand } from "../../structures/BaseCommand";
import { Command } from "../../utils/decorators/Command";
import i18n from "../../config";
import { ColorResolvable } from "discord.js";

@Command<typeof PingCommand>({
    aliases: ["pang", "pung", "peng", "pong"],
    description: i18n.__("commands.general.ping.description"),
    name: "ping",
    slash: {
        options: []
    },
    usage: "{prefix}ping"
})
export class PingCommand extends BaseCommand {
    public async execute(ctx: CommandContext): Promise<void> {
        if (ctx.isInteraction() && !ctx.deferred) await ctx.deferReply();

        const msg = await ctx.reply({ content: "🏓" });
        const before = msg.createdTimestamp;
        const latency = Date.now() - before;
        const wsLatency = this.client.ws.ping.toFixed(0);
        const vcLatency = ctx.guild?.queue?.connection?.ping.ws?.toFixed(0) ?? "N/A";
        const embed = createEmbed("info")
            .setColor(this.searchHex(wsLatency))
            .setAuthor({
                name: "🏓 PONG",
                iconURL: this.client.user!.displayAvatarURL()
            })
            .addFields(
                {
                    name: "📶 **|** Ping",
                    value: `**\`${latency}\`** ms`,
                    inline: true
                },
                {
                    name: "🌐 **|**Bot Ping",
                    value: `**\`${wsLatency}\`** ms`,
                    inline: true
                },
                {
                    name: "🔊 **|** Voice",
                    value: `**\`${vcLatency}\`** ms`,
                    inline: true
                }
            )
            .setFooter({
                text: i18n.__mf("commands.general.ping.footerString", { user: this.client.user!.tag }),
                iconURL: this.client.user!.displayAvatarURL()
            })
            .setTimestamp();
        msg.edit({ content: " ", embeds: [embed] }).catch(e => this.client.logger.error("PROMISE_ERR:", e));
    }

    // eslint-disable-next-line class-methods-use-this
    private searchHex(ms: number | string): ColorResolvable {
        const listColorHex = [
            [0, 20, "GREEN"],
            [21, 50, "GREEN"],
            [51, 100, "YELLOW"],
            [101, 150, "YELLOW"],
            [150, 200, "RED"]
        ];

        const defaultColor = "RED";

        const min = listColorHex.map(e => e[0]);
        const max = listColorHex.map(e => e[1]);
        const hex = listColorHex.map(e => e[2]);
        let ret: number | string = "#000000";

        for (let i = 0; i < listColorHex.length; i++) {
            if (min[i] <= ms && ms <= max[i]) {
                ret = hex[i];
                break;
            } else {
                ret = defaultColor;
            }
        }
        return ret as ColorResolvable;
    }
}
