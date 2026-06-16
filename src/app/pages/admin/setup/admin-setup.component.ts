import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SavedBackground } from '../../../models/background-library.models';
import {
  BACKGROUND_PRESETS,
  BingoMode,
  GamePack,
  SquareEntry,
} from '../../../models/game-pack.models';
import { BackgroundLibraryService } from '../../../services/background-library.service';
import { GamePackService } from '../../../services/game-pack.service';
import { buildShareUrl } from '../../../utils/pack-url';
import { validateCustomSquares } from '../../../utils/card-generator';

type BackgroundSource = 'preset' | 'library';

@Component({
  selector: 'app-admin-setup',
  templateUrl: './admin-setup.component.html',
  styleUrls: ['./admin-setup.component.scss'],
})
export class AdminSetupComponent implements OnInit, OnDestroy {
  readonly presets = BACKGROUND_PRESETS;
  readonly modes: { value: BingoMode; label: string }[] = [
    { value: 'standard', label: 'Standard 1–75 bingo' },
    { value: 'custom', label: 'Custom square phrases' },
  ];

  name = 'Bingo Game';
  mode: BingoMode = 'standard';
  backgroundSource: BackgroundSource = 'preset';
  backgroundPreset = 'assets/juneteenth-bg.png';
  selectedLibraryId: string | null = null;
  savedBackgrounds: SavedBackground[] = [];
  squares: SquareEntry[] = [{ text: '', definition: '' }];
  bulkText = '';
  squareInputMode: 'rows' | 'bulk' = 'rows';
  error = '';
  playerLink = '';
  callLink = '';
  copiedMessage = '';
  pasteHint = '';

  private librarySub?: Subscription;

  constructor(
    private readonly gamePackService: GamePackService,
    private readonly backgroundLibrary: BackgroundLibraryService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.librarySub = this.backgroundLibrary.library$.subscribe(items => {
      this.savedBackgrounds = items;
    });

    const existing = this.gamePackService.getPack();
    if (existing) {
      this.loadFromPack(existing);
    }
  }

  ngOnDestroy(): void {
    this.librarySub?.unsubscribe();
  }

  get selectedLibraryBackground(): SavedBackground | undefined {
    if (!this.selectedLibraryId) {
      return undefined;
    }
    return this.backgroundLibrary.getById(this.selectedLibraryId);
  }

  get playerBackgroundPreview(): string {
    if (this.backgroundSource === 'library' && this.selectedLibraryBackground) {
      return this.selectedLibraryBackground.dataUrl;
    }
    return this.backgroundPreset;
  }

  addSquare(): void {
    this.squares.push({ text: '', definition: '' });
  }

  removeSquare(index: number): void {
    if (this.squares.length <= 1) {
      this.squares = [{ text: '', definition: '' }];
      return;
    }
    this.squares.splice(index, 1);
  }

  switchToRows(): void {
    this.squareInputMode = 'rows';
  }

  switchToBulk(): void {
    this.bulkText = this.squaresToBulkText(this.squares);
    this.squareInputMode = 'bulk';
  }

  parseBulk(): void {
    this.squares = this.parseBulkText(this.bulkText);
    this.squareInputMode = 'rows';
  }

  private parseBulkText(text: string): SquareEntry[] {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) {
      return [{ text: '', definition: '' }];
    }
    return lines.map(line => {
      const pipeIndex = line.indexOf('|');
      if (pipeIndex === -1) {
        return { text: line.trim(), definition: '' };
      }
      return {
        text: line.slice(0, pipeIndex).trim(),
        definition: line.slice(pipeIndex + 1).trim(),
      };
    });
  }

  private squaresToBulkText(squares: SquareEntry[]): string {
    return squares
      .filter(s => s.text.trim())
      .map(s => s.definition.trim() ? `${s.text.trim()} | ${s.definition.trim()}` : s.text.trim())
      .join('\n');
  }

  buildPack(): GamePack {
    const cleanSquares = this.squares
      .map(s => ({ text: s.text.trim(), definition: s.definition.trim() }))
      .filter(s => s.text);

    if (this.mode === 'custom') {
      validateCustomSquares(cleanSquares);
    }

    const existing = this.gamePackService.getPack();
    return {
      id: existing?.id ?? crypto.randomUUID().slice(0, 8),
      name: this.name.trim() || 'Bingo Game',
      mode: this.mode,
      backgroundImageUrl: this.resolveBackgroundUrl(),
      squares: this.mode === 'custom' ? cleanSquares : [],
    };
  }

  selectPreset(value: string): void {
    this.backgroundSource = 'preset';
    this.backgroundPreset = value;
    this.selectedLibraryId = null;
    this.pasteHint = '';
  }

  selectLibraryItem(id: string): void {
    this.backgroundSource = 'library';
    this.selectedLibraryId = id;
    this.pasteHint = '';
  }

  removeLibraryItem(id: string, event: Event): void {
    event.stopPropagation();
    if (!confirm('Remove this saved background?')) {
      return;
    }
    this.backgroundLibrary.remove(id);
    if (this.selectedLibraryId === id) {
      this.selectPreset('assets/juneteenth-bg.png');
    }
  }

  onPasteZonePaste(event: ClipboardEvent): void {
    event.preventDefault();
    this.handleImageFiles(this.extractImagesFromDataTransfer(event.clipboardData));
  }

  onPasteZoneDrop(event: DragEvent): void {
    event.preventDefault();
    this.handleImageFiles(this.extractImagesFromDataTransfer(event.dataTransfer));
  }

  onPasteZoneDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onImageFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    input.value = '';
    this.handleImageFiles(files);
  }

  save(): void {
    this.error = '';
    this.copiedMessage = '';
    try {
      const pack = this.buildPack();
      this.gamePackService.save(pack);
      this.updateLinks(pack);
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Failed to save';
    }
  }

  goToCallBoard(): void {
    this.error = '';
    try {
      const pack = this.buildPack();
      this.gamePackService.save(pack);
      this.router.navigate(['/admin/call']);
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Failed to save';
    }
  }

  copyPlayerLink(): void {
    this.save();
    if (this.error || !this.playerLink) {
      return;
    }
    this.copyToClipboard(this.playerLink, 'Player link copied');
  }

  copyCallLink(): void {
    this.save();
    if (this.error || !this.callLink) {
      return;
    }
    this.copyToClipboard(this.callLink, 'Call board link copied');
  }

  downloadJson(): void {
    this.error = '';
    try {
      const pack = this.buildPack();
      this.gamePackService.save(pack);
      const blob = new Blob([JSON.stringify(pack, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `${pack.name.replace(/\s+/g, '-').toLowerCase()}-bingo.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Failed to download';
    }
  }

  onFileImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const pack = JSON.parse(String(reader.result)) as GamePack;
        this.gamePackService.save(pack);
        this.loadFromPack(pack);
        this.updateLinks(pack);
      } catch {
        this.error = 'Invalid JSON file';
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  private resolveBackgroundUrl(): string {
    if (this.backgroundSource === 'library') {
      const saved = this.selectedLibraryBackground;
      if (!saved) {
        throw new Error('Select a saved background or upload a new image');
      }
      return saved.dataUrl;
    }
    return this.backgroundPreset;
  }

  private async handleImageFiles(files: File[]): Promise<void> {
    this.error = '';
    this.pasteHint = '';
    const image = files.find(file => file.type.startsWith('image/'));
    if (!image) {
      this.error = 'Paste or upload an image file';
      return;
    }

    try {
      const saved = await this.backgroundLibrary.addFromBlob(image);
      this.selectLibraryItem(saved.id);
      this.pasteHint = `"${saved.name}" saved — select it below to use for players.`;
    } catch (e: unknown) {
      this.error = e instanceof Error ? e.message : 'Could not save image';
    }
  }

  private extractImagesFromDataTransfer(data: DataTransfer | null): File[] {
    if (!data) {
      return [];
    }

    const files: File[] = [];
    for (let i = 0; i < data.items.length; i++) {
      const item = data.items[i];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          files.push(file);
        }
      }
    }

    if (files.length === 0 && data.files.length) {
      return Array.from(data.files).filter(file => file.type.startsWith('image/'));
    }

    return files;
  }

  private loadFromPack(pack: GamePack): void {
    this.name = pack.name;
    this.mode = pack.mode;
    this.squares = pack.squares.length
      ? pack.squares.map(s => ({ ...s }))
      : [{ text: '', definition: '' }];

    const preset = this.presets.find(p => p.value === pack.backgroundImageUrl);
    if (preset) {
      this.selectPreset(preset.value);
    } else if (pack.backgroundImageUrl.startsWith('data:')) {
      const saved =
        this.backgroundLibrary.findByDataUrl(pack.backgroundImageUrl) ??
        this.backgroundLibrary.add(pack.backgroundImageUrl, `${pack.name} background`);
      this.selectLibraryItem(saved.id);
    } else if (pack.backgroundImageUrl) {
      this.selectPreset(pack.backgroundImageUrl);
    } else {
      this.selectPreset('');
    }

    this.updateLinks(pack);
  }

  private updateLinks(pack: GamePack): void {
    this.playerLink = buildShareUrl('/play', pack);
    this.callLink = buildShareUrl('/admin/call', pack);
  }

  private copyToClipboard(text: string, message: string): void {
    navigator.clipboard.writeText(text).then(
      () => {
        this.copiedMessage = message;
      },
      () => {
        this.error = 'Could not copy link';
      }
    );
  }
}
