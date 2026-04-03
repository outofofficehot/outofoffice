import React, { useState, useEffect, useRef, useCallback } from 'react';
import { brand } from '../brand';
import { LinkedInConnection } from '../hooks/useLinkedIn';

interface ConnectionSearchProps {
  onSelect: (connection: LinkedInConnection | string) => void;
  searchConnections: (query: string) => Promise<LinkedInConnection[]>;
  connectionsAvailable: boolean;
  placeholder?: string;
}

export const ConnectionSearch: React.FC<ConnectionSearchProps> = ({
  onSelect,
  searchConnections,
  connectionsAvailable,
  placeholder = "Their LinkedIn URL or name",
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LinkedInConnection[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Debounced search
  const handleSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2 || !connectionsAvailable) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // If it looks like a URL, don't search
    if (searchQuery.includes('linkedin.com') || searchQuery.includes('/in/')) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const connections = await searchConnections(searchQuery);
      setResults(connections);
      setShowDropdown(connections.length > 0);
      setSelectedIndex(-1);
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchConnections, connectionsAvailable]);

  // Handle input change with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || results.length === 0) {
      if (e.key === 'Enter' && query) {
        e.preventDefault();
        onSelect(query);
        setQuery('');
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex]);
        } else if (query) {
          onSelect(query);
          setQuery('');
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
    }
  };

  // Handle selection
  const handleSelect = (connection: LinkedInConnection) => {
    onSelect(connection);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.inputWrapper}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          placeholder={placeholder}
          style={styles.input}
        />
        {isSearching && <span style={styles.spinner}>⟳</span>}
      </div>

      {showDropdown && results.length > 0 && (
        <div ref={dropdownRef} style={styles.dropdown}>
          {results.map((conn, index) => (
            <div
              key={conn.id}
              onClick={() => handleSelect(conn)}
              style={{
                ...styles.dropdownItem,
                ...(index === selectedIndex ? styles.dropdownItemSelected : {}),
              }}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              {conn.picture ? (
                <img src={conn.picture} alt="" style={styles.avatar} />
              ) : (
                <div style={styles.avatarPlaceholder}>
                  {conn.firstName.charAt(0)}{conn.lastName.charAt(0)}
                </div>
              )}
              <div style={styles.connectionInfo}>
                <span style={styles.connectionName}>
                  {conn.firstName} {conn.lastName}
                </span>
                {conn.headline && (
                  <span style={styles.connectionHeadline}>{conn.headline}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!connectionsAvailable && (
        <p style={styles.hint}>
          Paste a LinkedIn URL (e.g., linkedin.com/in/username)
        </p>
      )}
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'relative',
    marginBottom: brand.spacing.md,
  },
  inputWrapper: {
    position: 'relative',
  },
  input: {
    width: '100%',
    padding: brand.spacing.md,
    paddingRight: '40px',
    fontSize: '16px',
    border: `1px solid ${brand.colors.pinkDark}`,
    borderRadius: brand.borderRadius.md,
    boxSizing: 'border-box',
    fontFamily: brand.fonts.body,
    background: brand.colors.pinkLight,
    color: brand.colors.textPrimary,
    outline: 'none',
  },
  spinner: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    animation: 'spin 1s linear infinite',
    color: brand.colors.textMuted,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: brand.colors.white,
    border: `1px solid ${brand.colors.pinkDark}`,
    borderRadius: brand.borderRadius.md,
    boxShadow: brand.shadows.card,
    marginTop: '4px',
    zIndex: 100,
    maxHeight: '300px',
    overflowY: 'auto',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: brand.spacing.md,
    padding: brand.spacing.md,
    cursor: 'pointer',
    transition: 'background 0.15s ease',
  },
  dropdownItemSelected: {
    background: brand.colors.pinkLight,
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: brand.borderRadius.full,
    objectFit: 'cover',
  },
  avatarPlaceholder: {
    width: '40px',
    height: '40px',
    borderRadius: brand.borderRadius.full,
    background: brand.colors.rust,
    color: brand.colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 600,
  },
  connectionInfo: {
    flex: 1,
    minWidth: 0,
  },
  connectionName: {
    display: 'block',
    fontWeight: 500,
    color: brand.colors.textPrimary,
    fontSize: '14px',
  },
  connectionHeadline: {
    display: 'block',
    fontSize: '12px',
    color: brand.colors.textMuted,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  hint: {
    fontSize: '12px',
    color: brand.colors.textMuted,
    marginTop: brand.spacing.xs,
    marginBottom: 0,
  },
};
