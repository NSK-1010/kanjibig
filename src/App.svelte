<script lang="ts">
    import unwrap from 'ts-unwrap';
    import dialogPolyfill from 'dialog-polyfill';
    import { onMount } from 'svelte';

    let exodialog: HTMLDialogElement;

    let input = "";
    let bigsize = 84;
    let result: HTMLElement;
    let spacing = {
        on: false,
        space: 0,
    };
    let exo = {
        font: "",
        size: 64
    };
    let vscroll = false;
    let height = 1080;

    interface Copyrights {
        year: string,
        name: string,
        url: string
    }

    onMount(() => {
        dialogPolyfill.registerDialog(exodialog);
    });

    const copyrights: Copyrights[] = [
        {
            year: "2024",
            name: "全て巨大な所為です。",
            url: "https://www.youtube.com/watch?v=RSU1jPF1Xuw",
        },
        {
            year: "2024",
            name: "実つまめ",
            url: "https://kanjibig.pages.dev/",
        }
    ];

    const oninput = () => {
        let chars = Array.from(input);
        let res = chars.map((c, i) => {
            if (i == 0) {
                if (unwrap(c.codePointAt(0)) >= 0x4E00 && unwrap(c.codePointAt(0)) <= 0x9FFF) {
                    return `<s${bigsize}>${c}`;
                } else {
                    return c;
                }
            } else {
                let cs = [chars[i-1].codePointAt(0), c.codePointAt(0)];
                if (unwrap(cs[1]) >= 0x4E00 && unwrap(cs[1]) <= 0x9FFF && (unwrap(cs[0]) <= 0x4E00 || unwrap(cs[0]) >= 0x9FFF)) {
                    return `<s${bigsize}>${c}`;
                } else if ((unwrap(cs[1]) <= 0x4E00 || unwrap(cs[1]) >= 0x9FFF) && (unwrap(cs[0]) >= 0x4E00 && unwrap(cs[0]) <= 0x9FFF)) {
                    return `<s>${c}`;
                } else {
                    return c
                }
            }
        });
        if (vscroll && (height > 0)) {
            res.splice(0, 0, `<p+0,+${height}>`)
        }
        if (spacing.on && spacing.space != 0) {
            result.innerText = res.join("").replaceAll("\n", `\n<p+0,${(spacing.space >= 0) ? `+${spacing.space}` : spacing.space}>`);
        } else {
            result.innerText = res.join("");
        }
    };

    const generateexo = async () => {
        const Encoding = await import('encoding-japanese');
        let exotext = `[0]
start=1
end=128
layer=1
overlay=1
camera=0
[0.0]
_name=テキスト
サイズ=${exo.size}
表示速度=0.0
文字毎に個別オブジェクト=0
移動座標上に表示する=0
自動スクロール=${vscroll ? 1 : 0}
B=0
I=0
type=0
autoadjust=0
soft=1
monospace=0
align=${vscroll ? 1 : 4}
spacing_x=0
spacing_y=0
precision=1
color=ffffff
color2=000000
font=${exo.font == "" ? "MS ゴシック" : exo.font}
text=${Encoding.convert(Encoding.stringToCode(result.innerText.replaceAll(/(?<!\r)\n/g, "\r\n")), "UTF16LE", "UNICODE").map((c) => c.toString(16).padStart(2, '0')).join("").padEnd(4096, "0").slice(0, 4096)}
[0.1]
_name=標準描画
X=0.0
Y=${vscroll ? (- height / 2).toFixed(1) : "0.0"}
Z=0.0
拡大率=100.00
透明度=0.0
回転=0.00
blend=0
`;
        let buf = Encoding.convert(Encoding.stringToCode(exotext), "SJIS", "UNICODE");
        let blob = new Blob([Uint8Array.from(buf)], {type: "text/plain"});
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "kanjibig.exo";
        a.click();
        URL.revokeObjectURL(url);
    };
</script>

<header class="fixed p-2 bg-white/20 dark:bg-neutral-900/20 backdrop-blur w-full">
    <p class="font-medium">漢字大き (Re:改)</p>
</header>

<main class="flex flex-col flex-1 gap-2 w-5/6 mt-12 mx-auto mb-auto">
    <label class="flex flex-col min-[512px]:flex-row align-middle gap-2">
        <span>漢字のサイズ<span class="hidden min-[512px]:inline">:</span></span>
        <input type="range" min={1} max={512} bind:value={bigsize} on:input={oninput} />
        <span>{bigsize}px</span>
    </label>

    <label class="flex flex-col min-[450px]:flex-row align-middle gap-2">
        <span class="flex gap-2">
            <input type="checkbox" bind:checked={spacing.on} on:change={oninput} />
            <span>改行ごとに共通の間隔を開ける<span class="hidden min-[450px]:inline">:</span></span>
        </span>
        <span class="flex gap-2 w-fit ml-auto min-[450px]:ml-0">
            <input type="number" bind:value={spacing.space} class="w-16" on:input={oninput} />
            <span class="-ml-1">px</span>
        </span>
    </label>

    <label class="flex flex-col min-[340px]:flex-row align-middle gap-2">
        <span class="flex gap-2">
            <input type="checkbox" bind:checked={vscroll} on:change={oninput} />
            <span>スクロール</span>
        </span>
        <span class="flex gap-2 w-fit ml-auto min-[340px]:ml-0">
            <span>縦幅:</span>
            <input type="number" bind:value={height} min={0} class="w-20" on:input={oninput} />
            <span class="-ml-1">px</span>
        </span>
    </label>

    <textarea bind:value={input} on:input={oninput} placeholder="ここに歌詞を入力" class="w-full min-h-20"></textarea>

    <button on:click={() => exodialog.showModal()} class="w-fit ml-auto">exo生成</button>

    <pre><code bind:this={result}></code></pre>
</main>

<dialog bind:this={exodialog}>
    <div class="flex flex-col gap-3">
        <div>
            <h5>フォント</h5>
            <input type="text" bind:value={exo.font} />
        </div>
        <div>
            <h5>デフォルトフォントサイズ</h5>
            <label class="flex align-middle gap-2">
                <input type="range" min={1} max={512} bind:value={exo.size} on:input={oninput} />
                <span>{exo.size}px</span>
            </label>
        </div>
        <div class="flex gap-2">
            <button on:click={() => exodialog.close()}>キャンセル</button>
            <button on:click={generateexo}>exo生成</button>
        </div>
    </div>
</dialog>

<footer class="text-sm px-4 py-2 bg-neutral-100 dark:bg-transparent text-center flex flex-col gap-1">
    {#each copyrights as c}
        <p>&copy;{c.year} <a href={c.url} target="_blank">{c.name}</a></p>
    {/each}
</footer>