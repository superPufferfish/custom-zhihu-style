import { myStorage } from '../commons/storage';
import { dom, domA, domP } from '../commons/tools';
import { myPreview } from './preview';

/** 预览动图回调 */
const callbackGIF: MutationCallback = async (mutationsList) => {
  const target = mutationsList[0].target as HTMLElement;
  const targetClassList = target.classList;
  const { showGIFinDialog } = await myStorage.getConfig();
  if (!(targetClassList.contains('isPlaying') && !targetClassList.contains('css-1isopsn') && showGIFinDialog)) return;
  const nodeVideo = target.querySelector('video');
  const nodeImg = target.querySelector('img');
  const srcImg = nodeImg ? nodeImg.src : '';
  nodeVideo ? myPreview.open(nodeVideo.src, target, true) : myPreview.open(srcImg, target);
};
const observerGIF = new MutationObserver(callbackGIF);
/** 挂载预览 observe */
export async function previewGIF() {
  // 因为 GIF 图是点击后切换到真正 GIF, 所以在点击切换后再打开弹窗
  // 使用 MutationObserver 监听元素属性变化
  const { showGIFinDialog } = await myStorage.getConfig();
  if (showGIFinDialog) {
    const nodeGIFs = domA('.GifPlayer:not(.ctz-processed)');
    for (let i = 0, len = nodeGIFs.length; i < len; i++) {
      const item = nodeGIFs[i];
      item.classList.add('ctz-processed');
      observerGIF.observe(item, { attributes: true, attributeFilter: ['class'] });
    }
  } else {
    observerGIF.disconnect();
  }
}

/** 键盘点击下一张或上一张图片（仅静态图片） */
export const keydownNextImage = (event: KeyboardEvent) => {
  const { key } = event;
  const nodeImgDialog = dom('.css-ypb3io') as HTMLImageElement;
  if ((key === 'ArrowRight' || key === 'ArrowLeft') && nodeImgDialog) {
    const src = nodeImgDialog.src;
    const nodeImage = dom(`img[src="${src}"]`);
    const nodeContentInner = domP(nodeImage, 'class', 'RichContent-inner') || domP(nodeImage, 'class', 'Post-RichTextContainer') || domP(nodeImage, 'class', 'QuestionRichText');
    if (nodeContentInner) {
      const images = Array.from(nodeContentInner.querySelectorAll('img')) as HTMLImageElement[];
      const index = images.findIndex((i) => i.src === src);

      const dialogChange = (nodeDialog: HTMLImageElement, nodeImage: HTMLImageElement) => {
        const { width, height, src } = nodeImage;
        const { innerWidth, innerHeight } = window;
        /** 网页宽高比 */
        const aspectRatioWindow = innerWidth / innerHeight;
        /** 图片宽高比 */
        const aspectRatioImage = width / height;
        /** 当前缩放比例，如果图片宽高比 > 网页宽高比，则使用图片宽度为基准计算 */
        const scale = aspectRatioImage > aspectRatioWindow ? (innerWidth - 200) / width : (innerHeight - 50) / height;
        const top = document.documentElement.scrollTop;
        const left = innerWidth / 2 - (width * scale) / 2;
        nodeDialog.src = src;
        nodeDialog.style.cssText =
          nodeDialog.style.cssText +
          `width: ${width}px;height: ${height}px;top: ${top}px;left: ${left}px;` +
          `transform: translateX(0) translateY(0) scale(${scale}) translateZ(0px);will-change:unset;` +
          `transform-origin: 0 0;`;
      };

      if (key === 'ArrowRight' && index < images.length - 1) {
        dialogChange(nodeImgDialog, images[index + 1]);
        return;
      }

      if (key === 'ArrowLeft' && index > 0) {
        dialogChange(nodeImgDialog, images[index - 1]);
        return;
      }
    }
  }
};
