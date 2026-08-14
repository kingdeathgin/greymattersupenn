#!/usr/bin/env swift

import Foundation
import AppKit

struct Article: Decodable {
    let slug: String
    let title: String
    let subtitle: String?
    let excerpt: String
    let category: String
    let author: String
    let artist: String
    let readingTime: Int
    let image: String
    let comingSoon: Bool?
}

struct TeamMember: Decodable {
    let name: String
    let role: String
    let image: String
}

struct Illustration {
    let after: String
    let path: String
    let caption: String
}

struct ArticleTheme {
    let background: NSColor
    let accent: NSColor
}

let fileManager = Foundation.FileManager.default
let root = URL(fileURLWithPath: fileManager.currentDirectoryPath)
let outputURL = root.appendingPathComponent("output/issue-one/grey-matters-penn-issue-one.pdf")
let singlePagesURL = root.appendingPathComponent("output/issue-one/grey-matters-penn-issue-one-single-pages.pdf")
try fileManager.createDirectory(at: outputURL.deletingLastPathComponent(), withIntermediateDirectories: true)

let metadataData = try Data(contentsOf: root.appendingPathComponent("data/articles.json"))
let articles = try JSONDecoder().decode([Article].self, from: metadataData)
let teamData = try Data(contentsOf: root.appendingPathComponent("data/team.json"))
let team = try JSONDecoder().decode([TeamMember].self, from: teamData)
let bodySource = try String(contentsOf: root.appendingPathComponent("data/article-bodies.ts"), encoding: .utf8)

let illustrations: [String: [Illustration]] = [
    "truth-behind-intelligence": [
        Illustration(after: "Newton did it all in 18 months.", path: "/images/articles/inline/intelligence-newton.png", caption: "Isaac Newton, scientific discovery, and the architecture of intelligence."),
        Illustration(after: "Since birth, the brain undergoes the process of neurogenesis", path: "/images/articles/inline/intelligence-synapse.png", caption: "Neurons communicating across a synapse."),
        Illustration(after: "One such notable shift in intelligence was the introduction of the g factor", path: "/images/articles/inline/intelligence-framework.png", caption: "A framework for understanding intelligence."),
    ],
    "written-in-our-genes": [
        Illustration(after: "One of the most famous cases from this research was that of the “Jim twins,”", path: "/images/articles/inline/genes-jim-twins.png", caption: "The Jim twins and the study of inherited traits."),
        Illustration(after: "This question becomes further pervasive when certain genetic syndromes substantiate", path: "/images/articles/inline/genes-chromosome-dna.png", caption: "Chromosomes and the DNA double helix."),
        Illustration(after: "Another strong case for the influence of genes comes from studies on addiction.", path: "/images/articles/inline/genes-addiction.png", caption: "Genetic vulnerability and addiction."),
    ],
    "altered-mitochondrial-trafficking": [
        Illustration(after: "In healthy neurons, mitochondrial transport is needed to keep neurons alive", path: "/images/articles/inline/mitochondrial-ap-v2.png", caption: "Mitochondrial transport within a neuron."),
        Illustration(after: "Calcium-sensitive adaptor proteins like Miro", path: "/images/articles/inline/mitochondrial-synapse-v2.png", caption: "Signaling across the synapse."),
    ],
    "the-shrinking-brain": [
        Illustration(after: "Our brains are not fully developed until age 25", path: "/images/articles/inline/shrinking-brain-aging-tree.png", caption: "Brain development and change across the lifespan."),
        Illustration(after: "Regular exercise, maintaining a healthy diet", path: "/images/articles/inline/shrinking-brain-exercise.png", caption: "Exercise supports lifelong brain health."),
    ],
    "thinking-in-tongues": [
        Illustration(after: "The development of speaking fluency in two or more languages", path: "/images/articles/inline/thinking-in-tongues-cognitive-chart.png", caption: "Cognitive performance in monolingual and multilingual people."),
    ],
    "the-accelerating-clock": [
        Illustration(after: "Alongside the slowing of the biological pacemaker", path: "/images/articles/inline/accelerating-clock-attention-model.png", caption: "Arousal, attention, and attentional switching."),
    ],
]

let articleThemes: [String: ArticleTheme] = [
    "truth-behind-intelligence": ArticleTheme(background: NSColor(calibratedRed: 0.965, green: 0.945, blue: 0.91, alpha: 1), accent: NSColor(calibratedRed: 0.44, green: 0.20, blue: 0.52, alpha: 1)),
    "written-in-our-genes": ArticleTheme(background: NSColor(calibratedRed: 0.91, green: 0.95, blue: 0.90, alpha: 1), accent: NSColor(calibratedRed: 0.16, green: 0.45, blue: 0.30, alpha: 1)),
    "altered-mitochondrial-trafficking": ArticleTheme(background: NSColor(calibratedRed: 0.98, green: 0.92, blue: 0.86, alpha: 1), accent: NSColor(calibratedRed: 0.75, green: 0.25, blue: 0.13, alpha: 1)),
    "the-shrinking-brain": ArticleTheme(background: NSColor(calibratedRed: 0.89, green: 0.94, blue: 0.96, alpha: 1), accent: NSColor(calibratedRed: 0.12, green: 0.40, blue: 0.57, alpha: 1)),
    "thinking-in-tongues": ArticleTheme(background: NSColor(calibratedRed: 0.94, green: 0.91, blue: 0.97, alpha: 1), accent: NSColor(calibratedRed: 0.43, green: 0.22, blue: 0.62, alpha: 1)),
    "the-accelerating-clock": ArticleTheme(background: NSColor(calibratedRed: 0.98, green: 0.95, blue: 0.82, alpha: 1), accent: NSColor(calibratedRed: 0.68, green: 0.39, blue: 0.05, alpha: 1)),
    "feeling-our-age": ArticleTheme(background: NSColor(calibratedRed: 0.97, green: 0.90, blue: 0.91, alpha: 1), accent: NSColor(calibratedRed: 0.62, green: 0.18, blue: 0.28, alpha: 1)),
]

func body(for slug: String) -> String? {
    let marker = "\"\(slug)\": `"
    guard let markerRange = bodySource.range(of: marker) else { return nil }
    let contentStart = markerRange.upperBound
    guard let contentEnd = bodySource.range(of: "`,", range: contentStart..<bodySource.endIndex)?.lowerBound else { return nil }
    return String(bodySource[contentStart..<contentEnd])
}

func separateReferences(from body: String) -> (article: String, references: [String]) {
    let separators: [(marker: String, keepMarkerText: Bool)] = [
        ("\n\nBibliography\n\n", false),
        ("\nBibliography\n", false),
        ("\n\nReferences\n", false),
        ("\nReferences\n", false),
        ("\n\nZiegler P. The Black Death.", true),
    ]
    for separator in separators {
        if let range = body.range(of: separator.marker) {
            let referenceStart = separator.keepMarkerText ? range.lowerBound : range.upperBound
            let references = body[referenceStart...]
                .components(separatedBy: .newlines)
                .map { $0.trimmingCharacters(in: .whitespacesAndNewlines) }
                .filter { !$0.isEmpty }
            return (String(body[..<range.lowerBound]), references)
        }
    }
    return (body, [])
}

let page = NSSize(width: 612, height: 792)
let margin: CGFloat = 54
let navy = NSColor(calibratedRed: 0.025, green: 0.09, blue: 0.15, alpha: 1)
let blue = NSColor(calibratedRed: 0.16, green: 0.68, blue: 0.95, alpha: 1)
let muted = NSColor(calibratedWhite: 0.72, alpha: 1)
let paper = NSColor(calibratedRed: 0.965, green: 0.955, blue: 0.925, alpha: 1)
let ink = NSColor(calibratedRed: 0.045, green: 0.10, blue: 0.14, alpha: 1)
var pageNumber = 0

let contributorSymbols: [String: String] = [
    "Elgin Tawiah": "brain", "Jeffrey Batres": "neuron", "Allen Phuong": "dna",
    "Augustus Clarke": "microscope", "Emmanuel Tawiah": "synapse", "Hans Manish": "vision",
    "Ian Peng": "cortex", "Isabelle Chen": "hearing", "Livia De La Rosa": "memory",
    "Zaid Alawa": "network", "Alexandra Gilfond": "molecule", "Asim Handy": "action potential",
    "Maria Costea": "glia", "Elias Mekuriaw": "circadian clock", "Jessica Anyanwu": "language",
]

func canonicalName(_ name: String) -> String {
    name == "Jeffery Batres" ? "Jeffrey Batres" : name
}

func authorNames(_ names: String) -> [String] {
    let range = NSRange(names.startIndex..., in: names)
    let separated = try! NSRegularExpression(pattern: "\\s+and\\s+|,\\s*")
        .stringByReplacingMatches(in: names, range: range, withTemplate: "|")
    return separated.components(separatedBy: "|").filter { !$0.isEmpty }
}

func font(_ size: CGFloat, weight: NSFont.Weight = .regular) -> NSFont {
    NSFont.systemFont(ofSize: size, weight: weight)
}

func paragraphStyle(lineHeight: CGFloat, spacing: CGFloat = 0) -> NSMutableParagraphStyle {
    let style = NSMutableParagraphStyle()
    style.minimumLineHeight = lineHeight
    style.maximumLineHeight = lineHeight
    style.paragraphSpacing = spacing
    return style
}

guard let consumer = CGDataConsumer(url: singlePagesURL as CFURL),
      var box = Optional(CGRect(origin: .zero, size: page)),
      let context = CGContext(consumer: consumer, mediaBox: &box, nil) else {
    fatalError("Unable to create PDF")
}

func beginPage(background: NSColor = navy) {
    context.beginPDFPage([:] as CFDictionary)
    pageNumber += 1
    NSGraphicsContext.saveGraphicsState()
    NSGraphicsContext.current = NSGraphicsContext(cgContext: context, flipped: false)
    background.setFill()
    NSBezierPath(rect: CGRect(origin: .zero, size: page)).fill()
}

func endPage() {
    NSGraphicsContext.restoreGraphicsState()
    context.endPDFPage()
}

func drawImage(_ path: String, in rect: NSRect) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    let scale = min(rect.width / image.size.width, rect.height / image.size.height)
    let size = NSSize(width: image.size.width * scale, height: image.size.height * scale)
    let target = NSRect(x: rect.midX - size.width / 2, y: rect.midY - size.height / 2, width: size.width, height: size.height)
    image.draw(in: target, from: NSRect.zero, operation: NSCompositingOperation.sourceOver, fraction: 1)
}

func drawImageCover(_ path: String, in rect: NSRect, fraction: CGFloat = 1) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    let scale = max(rect.width / image.size.width, rect.height / image.size.height)
    let sourceWidth = rect.width / scale
    let sourceHeight = rect.height / scale
    let source = NSRect(x: (image.size.width - sourceWidth) / 2, y: (image.size.height - sourceHeight) / 2, width: sourceWidth, height: sourceHeight)
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(rect: rect).addClip()
    image.draw(in: rect, from: source, operation: NSCompositingOperation.sourceOver, fraction: fraction)
    NSGraphicsContext.restoreGraphicsState()
}

func drawImageFrame(_ path: String, in rect: NSRect) {
    NSColor.white.setFill()
    NSBezierPath(rect: rect).fill()
    drawImage(path, in: rect.insetBy(dx: 10, dy: 10))
    NSColor(calibratedWhite: 0.78, alpha: 1).setStroke()
    let border = NSBezierPath(rect: rect)
    border.lineWidth = 0.6
    border.stroke()
}

func drawBlendedImage(_ path: String, in rect: NSRect, background: NSColor, variant: Int) {
    drawImageCover(path, in: rect)
}

func drawClippedCover(_ path: String, rect: NSRect, clip: NSBezierPath) {
    NSGraphicsContext.saveGraphicsState()
    clip.addClip()
    drawImageCover(path, in: rect)
    NSGraphicsContext.restoreGraphicsState()
}

func drawSpreadImageHalf(_ path: String, spreadHalf: Int) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    let spreadSize = NSSize(width: page.width * 2, height: page.height)
    let scale = max(spreadSize.width / image.size.width, spreadSize.height / image.size.height)
    let sourceWidth = spreadSize.width / scale
    let sourceHeight = spreadSize.height / scale
    let fullSource = NSRect(
        x: (image.size.width - sourceWidth) / 2,
        y: (image.size.height - sourceHeight) / 2,
        width: sourceWidth,
        height: sourceHeight
    )
    let halfSource = NSRect(
        x: fullSource.minX + CGFloat(spreadHalf) * fullSource.width / 2,
        y: fullSource.minY,
        width: fullSource.width / 2,
        height: fullSource.height
    )
    image.draw(in: NSRect(origin: .zero, size: page), from: halfSource, operation: .sourceOver, fraction: 1)
}

func drawArticleOpenerArtwork(_ article: Article) {
    let artRect = NSRect(x: 0, y: 235, width: page.width, height: page.height - 235)
    drawImageCover(article.image, in: artRect)
}

func drawContentMotif(slug: String, accent: NSColor) {
    accent.withAlphaComponent(0.085).setStroke()
    accent.withAlphaComponent(0.055).setFill()
    if slug == "the-accelerating-clock" {
        return
    }
    if slug == "written-in-our-genes" {
        for y in stride(from: CGFloat(90), through: 720, by: 42) { let rung=NSBezierPath(); rung.move(to:NSPoint(x:18,y:y)); rung.curve(to:NSPoint(x:594,y:y+18),controlPoint1:NSPoint(x:180,y:y+55),controlPoint2:NSPoint(x:430,y:y-35)); rung.lineWidth=0.8; rung.stroke() }
    } else if slug == "altered-mitochondrial-trafficking" {
        for i in 0..<6 { NSBezierPath(ovalIn:NSRect(x:CGFloat(-30+i*125),y:CGFloat(62+(i%2)*610),width:90,height:48)).fill() }
    } else if slug == "the-shrinking-brain" {
        for i in 0..<5 { let ring=NSBezierPath(ovalIn:NSRect(x:CGFloat(-110+i*18),y:CGFloat(120+i*22),width:CGFloat(320-i*36),height:CGFloat(320-i*36))); ring.lineWidth=1; ring.stroke() }
    } else if slug == "thinking-in-tongues" {
        for i in 0..<5 { let bubble=NSBezierPath(roundedRect:NSRect(x:CGFloat(470+i*18),y:CGFloat(95+i*130),width:100,height:54),xRadius:24,yRadius:24); bubble.lineWidth=1; bubble.stroke() }
    } else if slug == "feeling-our-age" {
        for i in 0..<10 { NSBezierPath(roundedRect:NSRect(x:CGFloat(i*68-18),y:735,width:44,height:CGFloat(24+(i%4)*17)),xRadius:22,yRadius:22).fill() }
    } else {
        for i in 0..<7 { let neuron=NSBezierPath(); neuron.move(to:NSPoint(x:CGFloat(i*96-12),y:792)); neuron.curve(to:NSPoint(x:CGFloat(i*92+42),y:665),controlPoint1:NSPoint(x:CGFloat(i*100+60),y:760),controlPoint2:NSPoint(x:CGFloat(i*88-20),y:705)); neuron.lineWidth=1.1; neuron.stroke() }
    }
}

func drawAvatar(_ path: String, in rect: NSRect) {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url) else { return }
    NSGraphicsContext.saveGraphicsState()
    NSBezierPath(ovalIn: rect).addClip()
    let scale = max(rect.width / image.size.width, rect.height / image.size.height)
    let size = NSSize(width: image.size.width * scale, height: image.size.height * scale)
    let target = NSRect(x: rect.midX - size.width / 2, y: rect.midY - size.height / 2, width: size.width, height: size.height)
    image.draw(in: target, from: NSRect.zero, operation: NSCompositingOperation.sourceOver, fraction: 1)
    NSGraphicsContext.restoreGraphicsState()
    blue.setStroke()
    let border = NSBezierPath(ovalIn: rect)
    border.lineWidth = 1.2
    border.stroke()
}

func themeFromArtwork(_ path: String) -> ArticleTheme {
    let url = root.appendingPathComponent(path.hasPrefix("/") ? "public" + path : path)
    guard let image = NSImage(contentsOf: url),
          let data = image.tiffRepresentation,
          let bitmap = NSBitmapImageRep(data: data) else {
        return ArticleTheme(background: paper, accent: blue)
    }

    let width = bitmap.pixelsWide
    let height = bitmap.pixelsHigh
    let borderX = max(1, width / 9)
    let borderY = max(1, height / 9)
    let step = max(1, min(width, height) / 80)
    var red: CGFloat = 0
    var green: CGFloat = 0
    var blueValue: CGFloat = 0
    var count: CGFloat = 0

    for y in stride(from: 0, to: height, by: step) {
        for x in stride(from: 0, to: width, by: step) where x < borderX || x >= width - borderX || y < borderY || y >= height - borderY {
            guard let color = bitmap.colorAt(x: x, y: y)?.usingColorSpace(.deviceRGB) else { continue }
            red += color.redComponent
            green += color.greenComponent
            blueValue += color.blueComponent
            count += 1
        }
    }

    guard count > 0 else { return ArticleTheme(background: paper, accent: blue) }
    red /= count
    green /= count
    blueValue /= count
    let background = NSColor(calibratedRed: 0.78 + red * 0.22, green: 0.78 + green * 0.22, blue: 0.78 + blueValue * 0.22, alpha: 1)
    let darkest = min(red, green, blueValue)
    let accentScale: CGFloat = darkest > 0.65 ? 0.55 : 0.72
    let accent = NSColor(calibratedRed: red * accentScale, green: green * accentScale, blue: blueValue * accentScale, alpha: 1)
    return ArticleTheme(background: background, accent: accent)
}

func draw(_ text: String, rect: NSRect, attributes: [NSAttributedString.Key: Any]) {
    NSString(string: text).draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attributes)
}

func drawContributorIcon(_ name: String, at origin: NSPoint, size: CGFloat, color: NSColor) {
    let circle = NSBezierPath(ovalIn: NSRect(x: origin.x, y: origin.y, width: size, height: size))
    color.withAlphaComponent(0.14).setFill()
    circle.fill()
    color.withAlphaComponent(0.55).setStroke()
    circle.lineWidth = 0.6
    circle.stroke()
    let symbol = contributorSymbols[canonicalName(name)] ?? "neuron"
    let center = NSPoint(x: origin.x + size / 2, y: origin.y + size / 2)
    color.withAlphaComponent(0.82).setStroke()
    color.setFill()
    let line = max(0.7, size * 0.055)
    func stroke(_ path: NSBezierPath) { path.lineWidth = line; path.stroke() }
    if symbol == "brain" || symbol == "cortex" || symbol == "memory" {
        let brain = NSBezierPath(roundedRect: NSRect(x: origin.x + size * 0.22, y: origin.y + size * 0.25, width: size * 0.56, height: size * 0.50), xRadius: size * 0.22, yRadius: size * 0.22)
        stroke(brain)
        let fold = NSBezierPath(); fold.move(to: NSPoint(x: center.x, y: origin.y + size * 0.27)); fold.curve(to: NSPoint(x: center.x, y: origin.y + size * 0.73), controlPoint1: NSPoint(x: center.x - size * 0.10, y: center.y), controlPoint2: NSPoint(x: center.x + size * 0.10, y: center.y)); stroke(fold)
        if symbol == "memory" { NSBezierPath(ovalIn: NSRect(x: center.x - size * 0.07, y: center.y - size * 0.07, width: size * 0.14, height: size * 0.14)).fill() }
    } else if symbol == "dna" {
        let a = NSBezierPath(); a.move(to: NSPoint(x: origin.x + size * 0.30, y: origin.y + size * 0.22)); a.curve(to: NSPoint(x: origin.x + size * 0.70, y: origin.y + size * 0.78), controlPoint1: NSPoint(x: origin.x + size * 0.80, y: origin.y + size * 0.34), controlPoint2: NSPoint(x: origin.x + size * 0.20, y: origin.y + size * 0.66)); stroke(a)
        let b = NSBezierPath(); b.move(to: NSPoint(x: origin.x + size * 0.70, y: origin.y + size * 0.22)); b.curve(to: NSPoint(x: origin.x + size * 0.30, y: origin.y + size * 0.78), controlPoint1: NSPoint(x: origin.x + size * 0.20, y: origin.y + size * 0.34), controlPoint2: NSPoint(x: origin.x + size * 0.80, y: origin.y + size * 0.66)); stroke(b)
    } else if symbol == "vision" {
        let eye = NSBezierPath(); eye.move(to: NSPoint(x: origin.x + size * 0.18, y: center.y)); eye.curve(to: NSPoint(x: origin.x + size * 0.82, y: center.y), controlPoint1: NSPoint(x: center.x - size * 0.13, y: origin.y + size * 0.74), controlPoint2: NSPoint(x: center.x + size * 0.13, y: origin.y + size * 0.74)); eye.curve(to: NSPoint(x: origin.x + size * 0.18, y: center.y), controlPoint1: NSPoint(x: center.x + size * 0.13, y: origin.y + size * 0.26), controlPoint2: NSPoint(x: center.x - size * 0.13, y: origin.y + size * 0.26)); stroke(eye); NSBezierPath(ovalIn: NSRect(x: center.x-size*0.08,y:center.y-size*0.08,width:size*0.16,height:size*0.16)).fill()
    } else if symbol == "hearing" {
        for i in 0..<3 { let arc = NSBezierPath(); arc.appendArc(withCenter: NSPoint(x: origin.x + size * 0.38, y: center.y), radius: size * (0.12 + CGFloat(i)*0.10), startAngle: -65, endAngle: 65); stroke(arc) }
    } else if symbol == "circadian clock" {
        stroke(NSBezierPath(ovalIn: NSRect(x: origin.x+size*0.22,y:origin.y+size*0.22,width:size*0.56,height:size*0.56))); let hands=NSBezierPath(); hands.move(to:center); hands.line(to:NSPoint(x:center.x,y:origin.y+size*0.69)); hands.move(to:center); hands.line(to:NSPoint(x:origin.x+size*0.66,y:center.y-size*0.10)); stroke(hands)
    } else if symbol == "language" {
        let bubble=NSBezierPath(roundedRect:NSRect(x:origin.x+size*0.18,y:origin.y+size*0.30,width:size*0.64,height:size*0.45),xRadius:size*0.15,yRadius:size*0.15); stroke(bubble); let tail=NSBezierPath(); tail.move(to:NSPoint(x:origin.x+size*0.35,y:origin.y+size*0.31)); tail.line(to:NSPoint(x:origin.x+size*0.27,y:origin.y+size*0.18)); tail.line(to:NSPoint(x:origin.x+size*0.48,y:origin.y+size*0.31)); stroke(tail)
    } else if symbol == "action potential" {
        let wave=NSBezierPath(); wave.move(to:NSPoint(x:origin.x+size*0.16,y:center.y)); wave.line(to:NSPoint(x:origin.x+size*0.38,y:center.y)); wave.line(to:NSPoint(x:origin.x+size*0.48,y:origin.y+size*0.75)); wave.line(to:NSPoint(x:origin.x+size*0.58,y:origin.y+size*0.25)); wave.line(to:NSPoint(x:origin.x+size*0.68,y:center.y)); wave.line(to:NSPoint(x:origin.x+size*0.84,y:center.y)); stroke(wave)
    } else if symbol == "synapse" {
        let left=NSBezierPath(); left.appendArc(withCenter:NSPoint(x:origin.x+size*0.28,y:center.y),radius:size*0.20,startAngle:-70,endAngle:70); stroke(left); let right=NSBezierPath(); right.appendArc(withCenter:NSPoint(x:origin.x+size*0.72,y:center.y),radius:size*0.20,startAngle:110,endAngle:250); stroke(right); for i in 0..<3 { NSBezierPath(ovalIn:NSRect(x:center.x-size*0.04,y:center.y+CGFloat(i-1)*size*0.16-size*0.04,width:size*0.08,height:size*0.08)).fill() }
    } else if symbol == "microscope" {
        let scope=NSBezierPath(); scope.move(to:NSPoint(x:origin.x+size*0.28,y:origin.y+size*0.24)); scope.line(to:NSPoint(x:origin.x+size*0.75,y:origin.y+size*0.24)); scope.move(to:NSPoint(x:origin.x+size*0.42,y:origin.y+size*0.30)); scope.curve(to:NSPoint(x:origin.x+size*0.62,y:origin.y+size*0.62),controlPoint1:NSPoint(x:origin.x+size*0.70,y:origin.y+size*0.32),controlPoint2:NSPoint(x:origin.x+size*0.70,y:origin.y+size*0.55)); scope.line(to:NSPoint(x:origin.x+size*0.54,y:origin.y+size*0.76)); stroke(scope)
    } else {
        let nodes = [NSPoint(x:center.x,y:origin.y+size*0.72),NSPoint(x:origin.x+size*0.25,y:origin.y+size*0.35),NSPoint(x:origin.x+size*0.75,y:origin.y+size*0.35)]
        for node in nodes { let p=NSBezierPath(); p.move(to:center); p.line(to:node); stroke(p); NSBezierPath(ovalIn:NSRect(x:node.x-size*0.055,y:node.y-size*0.055,width:size*0.11,height:size*0.11)).fill() }; NSBezierPath(ovalIn:NSRect(x:center.x-size*0.09,y:center.y-size*0.09,width:size*0.18,height:size*0.18)).fill()
    }
}

@discardableResult
func drawNamesWithIcons(_ names: String, x: CGFloat, y: CGFloat, maxWidth: CGFloat, fontSize: CGFloat, color: NSColor, iconColor: NSColor) -> CGFloat {
    var cursor = x
    let iconSize = fontSize + 3
    let attrs: [NSAttributedString.Key: Any] = [.font: font(fontSize, weight: .semibold), .foregroundColor: color]
    for (index, name) in authorNames(names).enumerated() {
        if index > 0 {
            draw(" & ", rect: NSRect(x: cursor, y: y, width: 18, height: iconSize), attributes: attrs)
            cursor += 18
        }
        drawContributorIcon(name, at: NSPoint(x: cursor, y: y - 1), size: iconSize, color: iconColor)
        cursor += iconSize + 4
        let width = min(maxWidth - (cursor - x), ceil(NSString(string: name).size(withAttributes: attrs).width) + 3)
        draw(name, rect: NSRect(x: cursor, y: y, width: width, height: iconSize + 2), attributes: attrs)
        cursor += width + 4
    }
    return cursor
}

func bodyText(_ text: String, attributes: [NSAttributedString.Key: Any], citationColor: NSColor = blue) -> NSMutableAttributedString {
    let result = NSMutableAttributedString(string: text, attributes: attributes)
    let patterns = [
        "([a-z\\)\\.,;:!?…”])(\\d{1,2}(?:\\s*,\\s*\\d{1,2})*)(?=[.\\s]|$)",
        "([\\.,;:!?…”])\\s+(\\d{1,2}(?:\\s*,\\s*\\d{1,2})*)$",
    ]
    for pattern in patterns {
        if let regex = try? NSRegularExpression(pattern: pattern) {
            let matches = regex.matches(in: text, range: NSRange(location: 0, length: result.length))
            for match in matches.reversed() {
                let citationRange = match.range(at: 2)
                result.addAttributes([
                    .font: font(7.2, weight: .semibold),
                    .foregroundColor: citationColor,
                    .baselineOffset: 4.2,
                ], range: citationRange)
            }
        }
    }
    return result
}

func drawAttributed(_ text: NSAttributedString, rect: NSRect) {
    text.draw(with: rect, options: [.usesLineFragmentOrigin, .usesFontLeading])
}

func drawPageNumber(color: NSColor = muted) {
    draw(String(format: "%02d", pageNumber), rect: NSRect(x: page.width - margin - 28, y: 25, width: 28, height: 16), attributes: [.font: font(8, weight: .semibold), .foregroundColor: color, .kern: 1.2])
}

// Cover
beginPage(background: .white)
drawImage("public/images/issues/issue-one-fall-2025-enhanced.png", in: NSRect(x: 0, y: 0, width: page.width, height: page.height))
endPage()

// Contents
beginPage()
draw("ISSUE ONE · FALL 2025", rect: NSRect(x: margin, y: 700, width: 500, height: 24), attributes: [.font: font(12, weight: .semibold), .foregroundColor: blue, .kern: 2.2])
draw("Inside the issue", rect: NSRect(x: margin, y: 640, width: 500, height: 52), attributes: [.font: font(38, weight: .light), .foregroundColor: NSColor.white])
var contentsY: CGFloat = 590
for (index, article) in articles.enumerated() {
    draw(String(format: "%02d", index + 1), rect: NSRect(x: margin, y: contentsY, width: 32, height: 24), attributes: [.font: font(11, weight: .bold), .foregroundColor: blue])
    draw(article.title, rect: NSRect(x: margin + 44, y: contentsY - 2, width: 430, height: 26), attributes: [.font: font(17, weight: .semibold), .foregroundColor: NSColor.white])
    if let subtitle = article.subtitle {
        draw(subtitle, rect: NSRect(x: margin + 44, y: contentsY - 23, width: 430, height: 20), attributes: [.font: font(10), .foregroundColor: muted])
    }
    draw("WRITTEN BY", rect: NSRect(x: margin + 44, y: contentsY - 42, width: 62, height: 16), attributes: [.font: font(7, weight: .bold), .foregroundColor: blue, .kern: 0.6])
    let creditEnd = drawNamesWithIcons(article.author, x: margin + 106, y: contentsY - 43, maxWidth: 230, fontSize: 7.5, color: .white, iconColor: blue)
    draw("ART  ", rect: NSRect(x: creditEnd, y: contentsY - 42, width: 30, height: 16), attributes: [.font: font(7, weight: .bold), .foregroundColor: blue])
    _ = drawNamesWithIcons(article.artist, x: creditEnd + 28, y: contentsY - 43, maxWidth: page.width - margin - creditEnd - 28, fontSize: 7.5, color: .white, iconColor: blue)
    contentsY -= 68
}
drawPageNumber()
endPage()

// Contributors
beginPage(background: paper)
draw("THE PEOPLE BEHIND ISSUE ONE", rect: NSRect(x: margin, y: 714, width: 500, height: 20), attributes: [.font: font(9, weight: .bold), .foregroundColor: blue, .kern: 1.8])
draw("Meet the team", rect: NSRect(x: margin, y: 650, width: 500, height: 52), attributes: [.font: font(38, weight: .light), .foregroundColor: ink])
draw("This issue reflects the work of our entire team—across writing, editing, art, production, podcasts, social media, operations, and finance.", rect: NSRect(x: margin, y: 604, width: 500, height: 40), attributes: [.font: font(10.5), .foregroundColor: NSColor(calibratedWhite: 0.35, alpha: 1), .paragraphStyle: paragraphStyle(lineHeight: 15)])
let contributorColumnWidth: CGFloat = 166
for (index, member) in team.enumerated() {
    let column = index % 3
    let row = index / 3
    let x = margin + CGFloat(column) * contributorColumnWidth
    let y = 545 - CGFloat(row) * 91
    drawContributorIcon(member.name, at: NSPoint(x: x, y: y + 8), size: 22, color: blue)
    draw(member.name, rect: NSRect(x: x + 29, y: y + 10, width: 121, height: 23), attributes: [.font: font(11, weight: .semibold), .foregroundColor: ink])
    draw(member.role, rect: NSRect(x: x, y: y - 18, width: 150, height: 28), attributes: [.font: font(8), .foregroundColor: NSColor(calibratedWhite: 0.38, alpha: 1), .paragraphStyle: paragraphStyle(lineHeight: 10)])
    draw((contributorSymbols[member.name] ?? "neuroscience").uppercased(), rect: NSRect(x: x + 29, y: y - 7, width: 121, height: 11), attributes: [.font: font(5.8, weight: .bold), .foregroundColor: blue, .kern: 0.55])
}
drawPageNumber(color: ink)
endPage()

var collectedReferences: [(article: Article, references: [String])] = []

for (index, article) in articles.enumerated() {
    let theme = themeFromArtwork(article.image)
    let isTimeArticle = article.slug == "the-accelerating-clock"
    let articlePaper = isTimeArticle ? NSColor.black : theme.background
    let articleAccent = isTimeArticle ? NSColor(calibratedRed: 0.67, green: 0.48, blue: 1.0, alpha: 1) : theme.accent
    let articleInk = isTimeArticle ? NSColor(calibratedWhite: 0.94, alpha: 1) : ink

    // Article opener
    let darkOpener = article.slug == "the-accelerating-clock"
    let openerInk = darkOpener ? NSColor.white : ink
    let openerMuted = darkOpener ? NSColor(calibratedWhite: 0.82, alpha: 1) : NSColor(calibratedWhite: 0.30, alpha: 1)

    beginPage(background: darkOpener ? NSColor.black : articlePaper)
    drawArticleOpenerArtwork(article)
    draw("ISSUE ONE  /  \(String(format: "%02d", index + 1))", rect: NSRect(x: margin, y: 214, width: 500, height: 20), attributes: [.font: font(9, weight: .bold), .foregroundColor: darkOpener ? NSColor.systemPurple : articleAccent, .kern: 1.6])
    draw(article.title, rect: NSRect(x: margin, y: 120, width: page.width - margin * 2, height: 88), attributes: [.font: font(34, weight: .light), .foregroundColor: openerInk, .paragraphStyle: paragraphStyle(lineHeight: 37)])
    if let subtitle = article.subtitle {
        draw(subtitle, rect: NSRect(x: margin, y: 72, width: page.width - margin * 2, height: 45), attributes: [.font: font(13), .foregroundColor: openerMuted, .paragraphStyle: paragraphStyle(lineHeight: 17)])
    }
    draw("WRITTEN BY", rect: NSRect(x: margin, y: 43, width: 72, height: 14), attributes: [.font: font(7, weight: .bold), .foregroundColor: articleAccent, .kern: 1.2])
    draw(article.author, rect: NSRect(x: margin + 76, y: 42, width: 240, height: 16), attributes: [.font: font(8.5, weight: .semibold), .foregroundColor: openerInk])
    draw("ARTWORK BY", rect: NSRect(x: 350, y: 43, width: 70, height: 14), attributes: [.font: font(7, weight: .bold), .foregroundColor: articleAccent, .kern: 1.2])
    draw(article.artist, rect: NSRect(x: 426, y: 42, width: 125, height: 16), attributes: [.font: font(8.5, weight: .semibold), .foregroundColor: openerInk])
    drawPageNumber(color: openerInk)
    endPage()

    guard let rawBody = body(for: article.slug), article.comingSoon != true else {
        beginPage(background: articlePaper)
        draw("ARTICLE FORTHCOMING", rect: NSRect(x: margin, y: 620, width: 500, height: 24), attributes: [.font: font(12, weight: .bold), .foregroundColor: articleAccent, .kern: 2])
        draw(article.excerpt, rect: NSRect(x: margin, y: 500, width: page.width - margin * 2, height: 100), attributes: [.font: font(23, weight: .light), .foregroundColor: ink, .paragraphStyle: paragraphStyle(lineHeight: 31)])
        draw("WRITTEN BY", rect: NSRect(x: margin, y: 455, width: 72, height: 20), attributes: [.font: font(8, weight: .bold), .foregroundColor: articleAccent])
        _ = drawNamesWithIcons(article.author, x: margin + 74, y: 454, maxWidth: 270, fontSize: 10, color: ink, iconColor: articleAccent)
        drawPageNumber(color: ink)
        endPage()
        continue
    }

    let separated = separateReferences(from: rawBody)
    if !separated.references.isEmpty {
        collectedReferences.append((article, separated.references))
    }
    let firstNewline = separated.article.firstIndex(of: "\n")
    let articleText = firstNewline.map { String(separated.article[separated.article.index(after: $0)...]) } ?? separated.article
    func looksLikeHeading(_ text: String) -> Bool {
        text.count < 80 && !text.contains(".") && !text.contains("doi:") && !text.contains("http")
    }

    var blocks: [String] = []
    var paragraphLines: [String] = []
    func flushParagraph() {
        if !paragraphLines.isEmpty {
            blocks.append(paragraphLines.joined(separator: " "))
            paragraphLines.removeAll()
        }
    }
    for sourceLine in articleText.components(separatedBy: .newlines) {
        let line = sourceLine.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
        if line.isEmpty {
            flushParagraph()
        } else if looksLikeHeading(line) {
            flushParagraph()
            blocks.append(line)
        } else {
            paragraphLines.append(line)
        }
    }
    flushParagraph()
    let columnGap: CGFloat = 24
    let readingWidth = (page.width - margin * 2 - columnGap) / 2
    let columnX: [CGFloat] = [margin, margin + readingWidth + columnGap]
    var currentColumn = 0
    var currentY: CGFloat = 698

    func beginArticlePage() {
        beginPage(background: articlePaper)
        drawContentMotif(slug: article.slug, accent: articleAccent)
        draw("GREY MATTERS  ·  ISSUE ONE", rect: NSRect(x: margin, y: 744, width: 220, height: 14), attributes: [.font: font(7.5, weight: .bold), .foregroundColor: articleAccent, .kern: 1.4])
        draw(article.title.uppercased(), rect: NSRect(x: 275, y: 744, width: page.width - margin - 275, height: 14), attributes: [.font: font(7.5, weight: .semibold), .foregroundColor: articleInk, .kern: 0.7])
        articleInk.withAlphaComponent(0.24).setStroke()
        let rule = NSBezierPath()
        rule.move(to: NSPoint(x: margin, y: 731))
        rule.line(to: NSPoint(x: page.width - margin, y: 731))
        rule.lineWidth = 0.5
        rule.stroke()
        draw("WRITTEN BY", rect: NSRect(x: margin, y: 43, width: 62, height: 14), attributes: [.font: font(7, weight: .bold), .foregroundColor: articleAccent, .kern: 0.5])
        _ = drawNamesWithIcons(article.author, x: margin + 64, y: 42, maxWidth: 280, fontSize: 7.5, color: articleInk.withAlphaComponent(0.72), iconColor: articleAccent)
        drawPageNumber(color: articleInk)
        currentColumn = 0
        currentY = 698
    }

    func advanceColumn() {
        if currentColumn == 0 {
            currentColumn = 1
            currentY = 698
        } else {
            endPage()
            beginArticlePage()
        }
    }

    func measuredHeight(_ text: String, attributes: [NSAttributedString.Key: Any], width: CGFloat = readingWidth) -> CGFloat {
        ceil(bodyText(text, attributes: attributes, citationColor: articleAccent).boundingRect(with: NSSize(width: width, height: 4000), options: [.usesLineFragmentOrigin, .usesFontLeading]).height) + 10
    }

    func fittingWordCount(_ words: [Substring], attributes: [NSAttributedString.Key: Any], availableHeight: CGFloat, width: CGFloat = readingWidth) -> Int {
        var low = 1
        var high = words.count
        var best = 0
        while low <= high {
            let middle = (low + high) / 2
            let candidate = words.prefix(middle).joined(separator: " ")
            if measuredHeight(candidate, attributes: attributes, width: width) <= availableHeight {
                best = middle
                low = middle + 1
            } else {
                high = middle - 1
            }
        }
        return best
    }

    var renderedIllustrations = Set<String>()
    func renderIllustration(_ illustration: Illustration) {
        let imageURL = root.appendingPathComponent("public" + illustration.path)
        let aspect = NSImage(contentsOf: imageURL).map { $0.size.width / $0.size.height } ?? 1.6
        let imageHeight = min(230, readingWidth / max(aspect, 0.5))
        let figureHeight = imageHeight + 34
        if currentY - figureHeight < 70 {
            advanceColumn()
        }
        currentY -= 6
        drawImageCover(
            illustration.path,
            in: NSRect(
                x: columnX[currentColumn],
                y: currentY - imageHeight,
                width: readingWidth,
                height: imageHeight
            )
        )
        currentY -= imageHeight + 7
        draw(
            illustration.caption,
            rect: NSRect(x: columnX[currentColumn], y: currentY - 20, width: readingWidth, height: 20),
            attributes: [
                .font: font(7.5, weight: .medium),
                .foregroundColor: articleAccent,
                .paragraphStyle: paragraphStyle(lineHeight: 10),
            ]
        )
        currentY -= 28
        renderedIllustrations.insert(illustration.path)
    }
    beginArticlePage()
    for block in blocks {
        let isHeading = looksLikeHeading(block)
        let attrs: [NSAttributedString.Key: Any] = isHeading
            ? [.font: font(18, weight: .semibold), .foregroundColor: articleAccent, .paragraphStyle: paragraphStyle(lineHeight: 23, spacing: 10)]
            : [.font: font(11), .foregroundColor: articleInk, .paragraphStyle: paragraphStyle(lineHeight: 17.2, spacing: 8)]
        var remainingWords = block.split(whereSeparator: { $0.isWhitespace })

        let matchingIllustration = illustrations[article.slug]?.first(where: {
            !renderedIllustrations.contains($0.path) && block.localizedCaseInsensitiveContains(String($0.after.prefix(30)))
        })

        while !remainingWords.isEmpty {
            let availableHeight = currentY - 70
            let fullText = remainingWords.joined(separator: " ")
            let fullHeight = measuredHeight(fullText, attributes: attrs)

            if fullHeight <= availableHeight {
                drawAttributed(bodyText(fullText, attributes: attrs, citationColor: articleAccent), rect: NSRect(x: columnX[currentColumn], y: currentY - fullHeight, width: readingWidth, height: fullHeight))
                currentY -= fullHeight
                remainingWords.removeAll()
                continue
            }

            let wordCount = fittingWordCount(remainingWords, attributes: attrs, availableHeight: availableHeight)
            if wordCount > 0 && !isHeading {
                let pageText = remainingWords.prefix(wordCount).joined(separator: " ")
                let pageHeight = measuredHeight(pageText, attributes: attrs)
                drawAttributed(bodyText(pageText, attributes: attrs, citationColor: articleAccent), rect: NSRect(x: columnX[currentColumn], y: currentY - pageHeight, width: readingWidth, height: pageHeight))
                remainingWords.removeFirst(wordCount)
            }

            advanceColumn()
        }

        if let illustration = matchingIllustration, !isHeading {
            renderIllustration(illustration)
        }
    }
    for illustration in illustrations[article.slug] ?? [] where !renderedIllustrations.contains(illustration.path) {
        renderIllustration(illustration)
    }
    endPage()
}

// End-of-issue references
if !collectedReferences.isEmpty {
    beginPage()
    draw("ISSUE ONE · SOURCES", rect: NSRect(x: margin, y: 700, width: 500, height: 24), attributes: [.font: font(10, weight: .bold), .foregroundColor: blue, .kern: 2])
    draw("References", rect: NSRect(x: margin, y: 620, width: 500, height: 65), attributes: [.font: font(46, weight: .light), .foregroundColor: NSColor.white])
    draw("Complete source lists for every article are collected here for easier reading and verification.", rect: NSRect(x: margin, y: 558, width: 440, height: 50), attributes: [.font: font(15), .foregroundColor: muted, .paragraphStyle: paragraphStyle(lineHeight: 21)])
    drawPageNumber()
    endPage()

    var referenceY: CGFloat = 690
    func beginReferencePage() {
        beginPage(background: paper)
        draw("GREY MATTERS  ·  ISSUE ONE  ·  REFERENCES", rect: NSRect(x: margin, y: 744, width: 350, height: 14), attributes: [.font: font(7.5, weight: .bold), .foregroundColor: blue, .kern: 1.3])
        drawPageNumber(color: ink)
        referenceY = 700
    }

    beginReferencePage()
    for entry in collectedReferences {
        if referenceY < 140 {
            endPage()
            beginReferencePage()
        }
        draw(entry.article.title, rect: NSRect(x: margin, y: referenceY - 28, width: 500, height: 28), attributes: [.font: font(17, weight: .semibold), .foregroundColor: navy])
        referenceY -= 42

        for (index, reference) in entry.references.enumerated() {
            let label = "\(index + 1)."
            let attrs: [NSAttributedString.Key: Any] = [.font: font(8.8), .foregroundColor: ink, .paragraphStyle: paragraphStyle(lineHeight: 12.5, spacing: 5)]
            let referenceHeight = ceil(NSString(string: reference).boundingRect(with: NSSize(width: 452, height: 1000), options: [.usesLineFragmentOrigin, .usesFontLeading], attributes: attrs).height) + 9
            if referenceY - referenceHeight < 62 {
                endPage()
                beginReferencePage()
            }
            draw(label, rect: NSRect(x: margin, y: referenceY - 14, width: 24, height: 14), attributes: [.font: font(8, weight: .bold), .foregroundColor: blue])
            draw(reference, rect: NSRect(x: margin + 28, y: referenceY - referenceHeight, width: 452, height: referenceHeight), attributes: attrs)
            referenceY -= referenceHeight
        }
        referenceY -= 24
    }
    endPage()
}

context.closePDF()

// Keep the front cover portrait, then pair every remaining page into a
// full-size landscape spread for magazine-style viewing.
guard let sourceDocument = CGPDFDocument(singlePagesURL as CFURL),
      let spreadConsumer = CGDataConsumer(url: outputURL as CFURL) else {
    fatalError("Unable to prepare two-page spreads")
}
var spreadBox = CGRect(x: 0, y: 0, width: page.width * 2, height: page.height)
guard let spreadContext = CGContext(consumer: spreadConsumer, mediaBox: &spreadBox, nil) else {
    fatalError("Unable to create spread PDF")
}
func mediaBoxData(_ rect: CGRect) -> CFData {
    var rect = rect
    return withUnsafeBytes(of: &rect) { bytes in
        CFDataCreate(nil, bytes.bindMemory(to: UInt8.self).baseAddress, bytes.count)
    }
}

if let coverPage = sourceDocument.page(at: 1) {
    let coverBox = CGRect(origin: .zero, size: page)
    spreadContext.beginPDFPage([kCGPDFContextMediaBox: mediaBoxData(coverBox)] as CFDictionary)
    spreadContext.drawPDFPage(coverPage)
    spreadContext.endPDFPage()
}

var sourcePageNumber = 2
while sourcePageNumber <= sourceDocument.numberOfPages {
    spreadContext.beginPDFPage([kCGPDFContextMediaBox: mediaBoxData(spreadBox)] as CFDictionary)
    if let leftPage = sourceDocument.page(at: sourcePageNumber) {
        spreadContext.drawPDFPage(leftPage)
    }
    if sourcePageNumber + 1 <= sourceDocument.numberOfPages,
       let rightPage = sourceDocument.page(at: sourcePageNumber + 1) {
        spreadContext.saveGState()
        spreadContext.translateBy(x: page.width, y: 0)
        spreadContext.drawPDFPage(rightPage)
        spreadContext.restoreGState()
    }
    spreadContext.endPDFPage()
    sourcePageNumber += 2
}
spreadContext.closePDF()
try? fileManager.removeItem(at: singlePagesURL)
print(outputURL.path)
