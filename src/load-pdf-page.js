import { pdfFileUrl } from './pdf-file-url.constant.js';

// Loaded via <script> tag, create shortcut to access PDF.js exports.
let pdfjsLib = window['pdfjs-dist/build/pdf'];

// The workerSrc property shall be specified.
pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs/pdf.worker.js';

// Asynchronous download of PDF
let loadingTask = pdfjsLib.getDocument(pdfFileUrl);
loadingTask.promise.then(function(pdf) {
    console.log('PDF loaded');

    // Fetch the first page
    let pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
        console.log('Page loaded');

        let scale = 1.5;
        let viewport = page.getViewport({scale: scale});

        // Prepare canvas using PDF page dimensions
        let canvas = document.getElementById('the-canvas');
        let context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        // Render PDF page into canvas context
        let renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        let renderTask = page.render(renderContext);
        renderTask.promise.then(function () {
            console.log('Page rendered');
        });
    });
}, function (reason) {
    // PDF loading error
    console.error(reason);
    const loadError = document.querySelector('.load-error');
    loadError.style.display = 'block';
});