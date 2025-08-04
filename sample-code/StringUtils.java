package com.example.testgen;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * String utility class with various text processing methods
 * Perfect for demonstrating JUnit test case generation
 */
public class StringUtils {
    
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");
    
    /**
     * Check if a string is null or empty
     * @param str String to check
     * @return true if string is null or empty
     */
    public static boolean isEmpty(String str) {
        return str == null || str.trim().isEmpty();
    }
    
    /**
     * Reverse a string
     * @param str String to reverse
     * @return Reversed string
     * @throws IllegalArgumentException if string is null
     */
    public static String reverse(String str) {
        if (str == null) {
            throw new IllegalArgumentException("String cannot be null");
        }
        return new StringBuilder(str).reverse().toString();
    }
    
    /**
     * Check if a string is a palindrome
     * @param str String to check
     * @return true if string is a palindrome
     */
    public static boolean isPalindrome(String str) {
        if (isEmpty(str)) {
            return false;
        }
        
        String cleaned = str.replaceAll("[^a-zA-Z0-9]", "").toLowerCase();
        return cleaned.equals(reverse(cleaned));
    }
    
    /**
     * Count occurrences of a character in a string
     * @param str String to search in
     * @param ch Character to count
     * @return Number of occurrences
     */
    public static int countOccurrences(String str, char ch) {
        if (isEmpty(str)) {
            return 0;
        }
        
        int count = 0;
        for (char c : str.toCharArray()) {
            if (c == ch) {
                count++;
            }
        }
        return count;
    }
    
    /**
     * Capitalize first letter of each word
     * @param str String to capitalize
     * @return Capitalized string
     */
    public static String capitalizeWords(String str) {
        if (isEmpty(str)) {
            return str;
        }
        
        String[] words = str.toLowerCase().split("\\s+");
        StringBuilder result = new StringBuilder();
        
        for (int i = 0; i < words.length; i++) {
            if (i > 0) {
                result.append(" ");
            }
            
            String word = words[i];
            if (!word.isEmpty()) {
                result.append(Character.toUpperCase(word.charAt(0)));
                if (word.length() > 1) {
                    result.append(word.substring(1));
                }
            }
        }
        
        return result.toString();
    }
    
    /**
     * Validate email format
     * @param email Email string to validate
     * @return true if email format is valid
     */
    public static boolean isValidEmail(String email) {
        if (isEmpty(email)) {
            return false;
        }
        return EMAIL_PATTERN.matcher(email).matches();
    }
    
    /**
     * Extract numbers from a string
     * @param str String to extract numbers from
     * @return List of integers found in the string
     */
    public static List<Integer> extractNumbers(String str) {
        List<Integer> numbers = new ArrayList<>();
        
        if (isEmpty(str)) {
            return numbers;
        }
        
        String[] tokens = str.split("\\D+");
        for (String token : tokens) {
            if (!token.isEmpty()) {
                try {
                    numbers.add(Integer.parseInt(token));
                } catch (NumberFormatException e) {
                    // Skip invalid numbers
                }
            }
        }
        
        return numbers;
    }
    
    /**
     * Remove duplicate characters from string
     * @param str Input string
     * @return String with duplicate characters removed
     */
    public static String removeDuplicates(String str) {
        if (isEmpty(str)) {
            return str;
        }
        
        StringBuilder result = new StringBuilder();
        boolean[] seen = new boolean[256]; // ASCII characters
        
        for (char c : str.toCharArray()) {
            if (!seen[c]) {
                result.append(c);
                seen[c] = true;
            }
        }
        
        return result.toString();
    }
    
    /**
     * Check if string contains only digits
     * @param str String to check
     * @return true if string contains only digits
     */
    public static boolean isNumeric(String str) {
        if (isEmpty(str)) {
            return false;
        }
        
        for (char c : str.toCharArray()) {
            if (!Character.isDigit(c)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Truncate string to specified length with ellipsis
     * @param str String to truncate
     * @param maxLength Maximum length
     * @return Truncated string
     */
    public static String truncate(String str, int maxLength) {
        if (maxLength < 0) {
            throw new IllegalArgumentException("Max length cannot be negative");
        }
        
        if (isEmpty(str) || str.length() <= maxLength) {
            return str;
        }
        
        if (maxLength <= 3) {
            return str.substring(0, maxLength);
        }
        
        return str.substring(0, maxLength - 3) + "...";
    }
}
