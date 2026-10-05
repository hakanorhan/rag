package com.example.aiservice.rag;

import java.io.IOException;
import java.util.List;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.ai.document.Document;
import org.springframework.ai.reader.pdf.PagePdfDocumentReader;
import org.springframework.ai.transformer.splitter.TokenTextSplitter;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Component
public class PdfDocumentProcessor {

    private static final TokenTextSplitter SPLITTER = TokenTextSplitter.builder().withChunkSize(400).build();

    public ParsedPdf process(MultipartFile file) {
        String filename = validateFilename(file);
        byte[] bytes = readBytes(file);
        List<Document> pages = readPages(bytes);
        return new ParsedPdf(filename, bytes, DigestUtils.sha256Hex(bytes), pages.size(), SPLITTER.split(pages));
    }

    private String validateFilename(MultipartFile file) {
        String filename = StringUtils.getFilename(StringUtils.cleanPath(file.getOriginalFilename()));
        if (file.isEmpty()
                || !StringUtils.hasText(filename)
                || filename.length() > 255
                || !"pdf".equalsIgnoreCase(StringUtils.getFilenameExtension(filename))
                || filename.chars().anyMatch(Character::isISOControl)) {
            throw new RagDocumentException(RagDocumentError.INVALID_PDF);
        }
        return filename;
    }

    private byte[] readBytes(MultipartFile file) {
        try {
            return file.getBytes();
        }
        catch (IOException exception) {
            throw new RagDocumentException(RagDocumentError.INVALID_PDF, exception);
        }
    }

    private List<Document> readPages(byte[] bytes) {
        try {
            return new PagePdfDocumentReader(new ByteArrayResource(bytes)).read();
        }
        catch (RuntimeException exception) {
            throw new RagDocumentException(RagDocumentError.INVALID_PDF, exception);
        }
    }
}
