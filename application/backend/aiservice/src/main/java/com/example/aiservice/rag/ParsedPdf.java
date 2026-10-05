package com.example.aiservice.rag;

import java.util.List;

import org.springframework.ai.document.Document;

record ParsedPdf(String filename, byte[] bytes, String sha256, int pageCount, List<Document> chunks) {
}
