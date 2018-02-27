import FileCache from './File';
import MemoryCache from './Memory';
import LocalStoreCache from './LocalStore';

export default {
    "File": FileCache,
    "Memory": MemoryCache,
    "Array": MemoryCache,
    "LocalStore": LocalStoreCache,
    "Local": LocalStoreCache
};