import Foundation
import Vision
import ImageIO

if CommandLine.arguments.count < 2 {
    fputs("Usage: swift ocr_apple_vision.swift image1 [image2 ...]\n", stderr)
    exit(2)
}

for path in CommandLine.arguments.dropFirst() {
    let url = URL(fileURLWithPath: path)
    guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
          let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
        fputs("Could not load image: \(path)\n", stderr)
        continue
    }

    let request = VNRecognizeTextRequest()
    request.recognitionLevel = .accurate
    request.usesLanguageCorrection = false
    request.recognitionLanguages = ["en-US", "ru-RU"]

    let handler = VNImageRequestHandler(cgImage: image, options: [:])
    do {
        try handler.perform([request])
        let lines = (request.results ?? [])
            .compactMap { $0.topCandidates(1).first?.string }
        print("--- \(url.lastPathComponent) ---")
        print(lines.joined(separator: "\n"))
    } catch {
        fputs("OCR failed for \(path): \(error)\n", stderr)
    }
}
